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
const mailSender_1 = require("../../utils/mailSender");
const auth_utils_1 = __importDefault(require("./auth.utils"));
const refreshTokensDB = [];
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign(user, config_1.default.access_token_secret, { expiresIn: '15m' });
}
function generateRefreshToken(user) {
    const token = jsonwebtoken_1.default.sign(user, config_1.default.refresh_token_secret, {
        expiresIn: '7d',
    });
    refreshTokensDB.push(token);
    return token;
}
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const getOTPExpiration = () => {
    return new Date(Date.now() + 3 * 60 * 1000); // 3 minutes in ms
};
const sendOtpEmail = (name, otp, email) => __awaiter(void 0, void 0, void 0, function* () {
    const content = auth_utils_1.default.generateOtpHtml(name, otp);
    yield (0, mailSender_1.mailSender)({
        to: email,
        subject: 'Email validation email from test school',
        html: content,
    });
});
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
        const otpCode = generateOTP();
        const otpExpiration = getOTPExpiration();
        payload.otpCode = otpCode;
        payload.otpExpiresAt = otpExpiration;
        user_validation_1.signUpValidationSchema.parse(payload);
        yield user_model_1.default.create(payload);
        yield sendOtpEmail(payload === null || payload === void 0 ? void 0 : payload.firstName, otpCode, payload === null || payload === void 0 ? void 0 : payload.email);
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
        role: user.role,
    });
    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    const responseData = {
        accessToken,
        refreshToken,
        userId: user.id,
        email: user.email,
        name: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`,
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
    if (!user.isEmailVerified) {
        const otpCode = generateOTP();
        const otpExpiration = getOTPExpiration();
        user.otpCode = otpCode;
        user.otpExpiresAt = otpExpiration;
        yield user.save();
        yield sendOtpEmail(user === null || user === void 0 ? void 0 : user.firstName, otpCode, user === null || user === void 0 ? void 0 : user.email);
        throw new ApiErrot_1.default(http_status_1.default.FORBIDDEN, 'your emil is not verified, verify your email first');
    }
    return { role: user.role };
});
const verifyOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.otp)) {
        throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'please provide otp');
    }
    const user = yield user_model_1.default.findOne({ otpCode: payload === null || payload === void 0 ? void 0 : payload.otp });
    if (!user) {
        throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'unauthorize user');
    }
    // Check if OTP expired (assuming you have otpExpires field as Date)
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'OTP has expired');
    }
    yield user_model_1.default.findOneAndUpdate({ otpCode: payload === null || payload === void 0 ? void 0 : payload.otp }, { isEmailVerified: true }, { new: true });
    return { message: 'success' };
});
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user)
            throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
        const otpCode = generateOTP();
        const otpExpiration = getOTPExpiration();
        yield sendOtpEmail(user === null || user === void 0 ? void 0 : user.firstName, otpCode, user === null || user === void 0 ? void 0 : user.email);
        yield user_model_1.default.findOneAndUpdate({ id: user.id }, { otpCode, otpExpiresAt: otpExpiration }, { new: true });
        return { message: 'sent' };
    }
    catch (error) { }
});
// app.post('/refresh', (req, res) => {
//     const { refreshToken } = req.body
//     if (!refreshToken || !refreshTokensDB.includes(refreshToken)) {
//         return res.sendStatus(403)
//     }
//     jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403)
//         const accessToken = generateAccessToken({
//             id: user.id,
//             email: user.email,
//         })
//         res.json({ accessToken })
//     })
// })
function refreshToken(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken } = payload;
        if (!refreshToken || !refreshTokensDB.includes(refreshToken)) {
            throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
        }
        try {
            // Verify refresh token and extract user payload
            const user = jsonwebtoken_1.default.verify(refreshToken, config_1.default.refresh_token_secret);
            // Generate new access token
            const accessToken = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            return { accessToken };
        }
        catch (error) {
            throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token');
        }
    });
}
const AuthServices = {
    signup,
    signin,
    verifyOtp,
    verifySignin,
    resendOtp,
    refreshToken,
};
exports.default = AuthServices;
