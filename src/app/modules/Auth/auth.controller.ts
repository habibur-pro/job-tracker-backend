import httpStatus from 'http-status'
import sendResponse from '../../helpers/sendResponse'
import catchAsync from '../../helpers/asyncHandler'
import AuthServices from './auth.service'

const signup = catchAsync(async (req, res) => {
    const data = await AuthServices.signup(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'signup success',
        data: data,
    })
})
const signIn = catchAsync(async (req, res) => {
    const data = await AuthServices.signin(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'signin success',
        data: data,
    })
})

const verifySignin = catchAsync(async (req, res) => {
    const data = await AuthServices.verifySignin(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'verify signin success',
        data: data,
    })
})
const autoSignin = catchAsync(async (req, res) => {
    const data = await AuthServices.autoSignin(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'auto signin success',
        data: data,
    })
})

const refreshToken = catchAsync(async (req, res) => {
    const data = await AuthServices.refreshToken(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'token refresh success',
        data: data,
    })
})
const AuthController = {
    signup,
    signIn,
    verifySignin,
    refreshToken,
    autoSignin,
}
export default AuthController
