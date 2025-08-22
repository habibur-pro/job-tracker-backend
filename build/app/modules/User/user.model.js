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
const mongoose_1 = require("mongoose");
const enum_1 = require("../../enum");
const idGenerator_1 = __importDefault(require("../../helpers/idGenerator"));
const UserSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'User ID is required'],
        unique: true,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: Object.values(enum_1.UserRole),
        required: [true, 'User role is required'],
        default: enum_1.UserRole.STUDENT,
    },
    isEmailVerified: {
        type: Boolean,
        required: [true, 'Email verification status is required'],
        default: false,
    },
    otpCode: {
        type: String,
        required: [true, 'OTP code is required'],
    },
    otpExpiresAt: {
        type: Date,
        required: [true, 'OTP expiry date is required'],
    },
}, {
    timestamps: true,
});
UserSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.id) {
            this.id = yield (0, idGenerator_1.default)(this.constructor);
        }
        next();
    });
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
