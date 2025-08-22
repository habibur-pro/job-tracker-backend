"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.default.signup);
router.post('/signin', auth_controller_1.default.signIn);
router.post('/verify-otp', auth_controller_1.default.verifyOtp);
router.post('/verify-signin', auth_controller_1.default.verifySignin);
router.post('/resend-otp', auth_controller_1.default.resendOtp);
router.post('/refresh', auth_controller_1.default.refreshToken);
const AuthRoutes = router;
exports.default = AuthRoutes;
