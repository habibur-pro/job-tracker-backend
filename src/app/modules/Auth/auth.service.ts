import ApiError from '../../helpers/ApiErrot'
import httpStatus from 'http-status'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { IUser } from '../User/user.interface'
import User from '../User/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { signUpValidationSchema } from '../User/user.validation'
import ms from 'ms'
import { IAutoSignInPayload } from './auth.interface'
import axios from 'axios'
const refreshTokensDB: string[] = []

function generateAccessToken(user: any) {
    return jwt.sign(user, config.access_token_secret, {
        expiresIn: config.access_token_expires_in as any,
    })
}

function generateRefreshToken(user: any) {
    const token = jwt.sign(user, config.refresh_token_secret, {
        expiresIn: config.refresh_token_expires_in as any,
    })
    refreshTokensDB.push(token)
    return token
}

const signup = async (payload: Partial<IUser>) => {
    try {
        const isExist = await User.findOne({ email: payload.email })
        if (isExist)
            throw new ApiError(httpStatus.CONFLICT, 'email already exist')
        if (!payload.password) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Password is required')
        }
        // hash password
        const hashedPassword = await bcrypt.hash(payload.password, 10)
        payload.password = hashedPassword
        signUpValidationSchema.parse(payload)
        await User.create(payload)

        return { message: 'success' }
    } catch (error) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            getErrorMessage(error) || 'something went wrong'
        )
    }
}

const signin = async (payload: { email: string; password: string }) => {
    if (!payload?.email || !payload?.password) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'email, password is required'
        )
    }

    const user = await User.findOne({ email: payload.email })
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'user not found')
    }
    const isMatched = await bcrypt.compare(payload.password, user.password)
    if (!isMatched) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'wrong email or password')
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
    })
    const refreshToken = generateRefreshToken({
        id: user.id,
    })
    // calculate expiry timestamps
    const accessTokenExpiresInMs = ms(
        (config.access_token_expires_in as any) || '15m'
    )
    const refreshTokenExpiresInMs = ms(
        (config.refresh_token_expires_in as any) || '7d'
    )
    const responseData = {
        accessToken,
        refreshToken,
        id: user.id,
        email: user.email,
        name: user.name,
        accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
    }
    return responseData
}
const verifySignin = async (payload: { email: string; password: string }) => {
    if (!payload?.email || !payload?.password) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'email and password is required'
        )
    }

    const user = await User.findOne({ email: payload.email })
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'user not found')
    }
    const isMatched = await bcrypt.compare(payload.password, user.password)
    if (!isMatched) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'wrong email or password')
    }

    return { message: 'verify success' }
}

export async function refreshToken(payload: { refreshToken?: string }) {
    const { refreshToken } = payload

    if (!refreshToken || !refreshTokensDB.includes(refreshToken)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access')
    }

    try {
        // Verify refresh token and extract user payload
        const token = jwt.verify(refreshToken, config.refresh_token_secret) as {
            id: string
        }
        const user = await User.findOne({ id: token.id })
        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'user not found')
        }

        // Generate new access token
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
        })
        // Generate new refresh token
        const newRefreshToken = generateRefreshToken({
            id: user.id,
        })
        // calculate expiry timestamps
        const accessTokenExpiresInMs = ms(
            (config.access_token_expires_in as any) || '15m'
        )
        return {
            accessToken,
            refreshToken: newRefreshToken,
            accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
        }
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
    }
}

const autoSignin = async (payload: IAutoSignInPayload) => {
    try {
        let profile: any

        switch (payload.provider) {
            case 'google': {
                const { data } = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${payload.access_token}`,
                        },
                    }
                )

                if (!data?.email) {
                    throw new ApiError(httpStatus.UNAUTHORIZED, 'failed login')
                }
                const user = await User.findOne({ email: data?.email })
                if (user) {
                    // Generate new access token
                    const accessToken = generateAccessToken({
                        id: user.id,
                        email: user.email,
                    })
                    // Generate new refresh token
                    const refreshToken = generateRefreshToken({
                        id: user.id,
                    })
                    const accessTokenExpiresInMs = ms(
                        (config.access_token_expires_in as any) || '15m'
                    )
                    const responseData = {
                        accessToken,
                        refreshToken,
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        photo: user.photo,
                        accessTokenExpiresAt:
                            Date.now() + accessTokenExpiresInMs,
                    }
                    return responseData
                    // generate access token and send to client with others data
                } else {
                    const newUser = await User.create({
                        email: data?.email,
                        name: data?.name || null,
                        photo: data?.picture || null,
                    })

                    const accessToken = generateAccessToken({
                        id: newUser.id,
                        email: newUser.email,
                    })
                    // Generate new refresh token
                    const refreshToken = generateRefreshToken({
                        id: newUser.id,
                    })
                    const accessTokenExpiresInMs = ms(
                        (config.access_token_expires_in as any) || '15m'
                    )
                    const responseData = {
                        accessToken,
                        refreshToken,
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        photo: newUser.photo,
                        accessTokenExpiresAt:
                            Date.now() + accessTokenExpiresInMs,
                    }
                    return responseData
                }
            }

            case 'github': {
                // Step 1: Get GitHub user profile
                const { data: githubUser } = await axios.get(
                    'https://api.github.com/user',
                    {
                        headers: {
                            Authorization: `Bearer ${payload.access_token}`, // Use access_token here
                        },
                    }
                )
                console.log('user data', githubUser)
                // Step 2: Get GitHub emails
                const { data: emails } = await axios.get(
                    'https://api.github.com/user/emails',
                    {
                        headers: {
                            Authorization: `Bearer ${payload.access_token}`, // Use same access token
                        },
                    }
                )
                console.log('email', emails)
                const primaryEmail =
                    emails.find((e: any) => e.primary && e.verified)?.email ||
                    emails[0]?.email

                if (!primaryEmail) {
                    throw new ApiError(
                        httpStatus.UNAUTHORIZED,
                        'No verified email found'
                    )
                }

                // Step 3: Find or create user in your database
                let user = await User.findOne({ email: primaryEmail })
                console.log('exist user', user)
                if (!user) {
                    user = await User.create({
                        email: primaryEmail,
                        name: githubUser.name || githubUser.login,
                        photo: githubUser.avatar_url || null,
                    })
                }

                // Step 4: Generate your backend JWT tokens
                const accessToken = generateAccessToken({
                    id: user.id,
                    email: user.email,
                })
                const refreshToken = generateRefreshToken({ id: user.id })
                const accessTokenExpiresInMs = ms(
                    (config.access_token_expires_in as any) || '15m'
                )

                return {
                    accessToken,
                    refreshToken,
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    photo: user.photo,
                    accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
                }
            }

            default:
                throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid provider')
        }
    } catch (error: any) {
        console.error(error?.response?.data || error.message)
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Failed to verify provider access token'
        )
    }
}

const AuthServices = {
    signup,
    signin,
    verifySignin,
    refreshToken,
    autoSignin,
}
export default AuthServices
