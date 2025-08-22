"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = refreshToken;
const ApiErrot_1 = __importDefault(require("../../helpers/ApiErrot"));
const http_status_1 = __importDefault(require("http-status"));
const getErrorMessage_1 = require("../../utils/getErrorMessage");
const user_model_1 = __importDefault(require("../User/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const user_validation_1 = require("../User/user.validation");
const ms_1 = __importDefault(require("ms"));
const axios_1 = __importDefault(require("axios"));
const refreshTokensDB = [];
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign(user, config_1.default.access_token_secret, {
        expiresIn: config_1.default.access_token_expires_in,
    });
}
function generateRefreshToken(user) {
    const token = jsonwebtoken_1.default.sign(user, config_1.default.refresh_token_secret, {
        expiresIn: config_1.default.refresh_token_expires_in,
    });
    refreshTokensDB.push(token);
    return token;
}
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExist = yield user_model_1.default.findOne({ email: payload.email });
        if (isExist)
            throw new ApiErrot_1.default(http_status_1.default.CONFLICT, 'email already exist');
        if (!payload.password) {
            throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'Password is required');
        }
        // hash password
        const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
        payload.password = hashedPassword;
        user_validation_1.signUpValidationSchema.parse(payload);
        yield user_model_1.default.create(payload);
        return { message: 'success' };
    }
    catch (error) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, (0, getErrorMessage_1.getErrorMessage)(error) || 'something went wrong');
    }
});
const signin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.email) || !(payload === null || payload === void 0 ? void 0 : payload.password)) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'email, password is required');
    }
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    const isMatched = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isMatched) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'wrong email or password');
    }
    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
    });
    const refreshToken = generateRefreshToken({
        id: user.id,
    });
    // calculate expiry timestamps
    const accessTokenExpiresInMs = (0, ms_1.default)(config_1.default.access_token_expires_in || '15m');
    const refreshTokenExpiresInMs = (0, ms_1.default)(config_1.default.refresh_token_expires_in || '7d');
    const responseData = {
        accessToken,
        refreshToken,
        id: user.id,
        email: user.email,
        name: user.name,
        accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
    };
    return responseData;
});
const verifySignin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.email) || !(payload === null || payload === void 0 ? void 0 : payload.password)) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'email and password is required');
    }
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    const isMatched = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isMatched) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'wrong email or password');
    }
    return { message: 'verify success' };
});
function refreshToken(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken } = payload;
        if (!refreshToken || !refreshTokensDB.includes(refreshToken)) {
            throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
        }
        try {
            // Verify refresh token and extract user payload
            const token = jsonwebtoken_1.default.verify(refreshToken, config_1.default.refresh_token_secret);
            const user = yield user_model_1.default.findOne({ id: token.id });
            if (!user) {
                throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
            }
            // Generate new access token
            const accessToken = generateAccessToken({
                id: user.id,
                email: user.email,
            });
            // Generate new refresh token
            const newRefreshToken = generateRefreshToken({
                id: user.id,
            });
            // calculate expiry timestamps
            const accessTokenExpiresInMs = (0, ms_1.default)(config_1.default.access_token_expires_in || '15m');
            return {
                accessToken,
                refreshToken: newRefreshToken,
                accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
            };
        }
        catch (error) {
            throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token');
        }
    });
}
const autoSignin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let profile;
        switch (payload.provider) {
            case 'google': {
                const { data } = yield axios_1.default.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${payload.access_token}`,
                    },
                });
                if (!(data === null || data === void 0 ? void 0 : data.email)) {
                    throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'failed login');
                }
                const user = yield user_model_1.default.findOne({ email: data === null || data === void 0 ? void 0 : data.email });
                if (user) {
                    // Generate new access token
                    const accessToken = generateAccessToken({
                        id: user.id,
                        email: user.email,
                    });
                    // Generate new refresh token
                    const refreshToken = generateRefreshToken({
                        id: user.id,
                    });
                    const accessTokenExpiresInMs = (0, ms_1.default)(config_1.default.access_token_expires_in || '15m');
                    const responseData = {
                        accessToken,
                        refreshToken,
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        photo: user.photo,
                        accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
                    };
                    return responseData;
                    // generate access token and send to client with others data
                }
                else {
                    const newUser = yield user_model_1.default.create({
                        email: data === null || data === void 0 ? void 0 : data.email,
                        name: (data === null || data === void 0 ? void 0 : data.name) || null,
                        photo: (data === null || data === void 0 ? void 0 : data.picture) || null,
                    });
                    const accessToken = generateAccessToken({
                        id: newUser.id,
                        email: newUser.email,
                    });
                    // Generate new refresh token
                    const refreshToken = generateRefreshToken({
                        id: newUser.id,
                    });
                    const accessTokenExpiresInMs = (0, ms_1.default)(config_1.default.access_token_expires_in || '15m');
                    const responseData = {
                        accessToken,
                        refreshToken,
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        photo: newUser.photo,
                        accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
                    };
                    return responseData;
                }
            }
            case 'github': {
                // Step 1: Get GitHub user profile
                const { data: githubUser } = yield axios_1.default.get('https://api.github.com/user', {
                    headers: {
                        Authorization: `Bearer ${payload.access_token}`, // Use access_token here
                    },
                });
                console.log('user data', githubUser);
                // Step 2: Get GitHub emails
                const { data: emails } = yield axios_1.default.get('https://api.github.com/user/emails', {
                    headers: {
                        Authorization: `Bearer ${payload.access_token}`, // Use same access token
                    },
                });
                console.log('email', emails);
                const primaryEmail = ((_a = emails.find((e) => e.primary && e.verified)) === null || _a === void 0 ? void 0 : _a.email) ||
                    ((_b = emails[0]) === null || _b === void 0 ? void 0 : _b.email);
                if (!primaryEmail) {
                    throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'No verified email found');
                }
                // Step 3: Find or create user in your database
                let user = yield user_model_1.default.findOne({ email: primaryEmail });
                console.log('exist user', user);
                if (!user) {
                    user = yield user_model_1.default.create({
                        email: primaryEmail,
                        name: githubUser.name || githubUser.login,
                        photo: githubUser.avatar_url || null,
                    });
                }
                // Step 4: Generate your backend JWT tokens
                const accessToken = generateAccessToken({
                    id: user.id,
                    email: user.email,
                });
                const refreshToken = generateRefreshToken({ id: user.id });
                const accessTokenExpiresInMs = (0, ms_1.default)(config_1.default.access_token_expires_in || '15m');
                return {
                    accessToken,
                    refreshToken,
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    photo: user.photo,
                    accessTokenExpiresAt: Date.now() + accessTokenExpiresInMs,
                };
            }
            default:
                throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'Invalid provider');
        }
    }
    catch (error) {
        console.error(((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
        throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'Failed to verify provider access token');
    }
});
const AuthServices = {
    signup,
    signin,
    verifySignin,
    refreshToken,
    autoSignin,
};
exports.default = AuthServices;
