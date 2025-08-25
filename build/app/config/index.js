"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const config = {
    env: 'development',
    port: process.env.PORT,
    db_uri: process.env.DB_URI,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    mailer_name: process.env.MAILER_NAME,
    mailer_pass: process.env.MAILER_PASS,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    cloudinary_cloud: process.env.CLOUDINARY_CLOUD,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
exports.default = config;
