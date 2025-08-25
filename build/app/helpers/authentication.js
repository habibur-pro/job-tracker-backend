"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const ApiErrot_1 = __importDefault(require("./ApiErrot"));
// ✅ Reusable authorize middleware
const authentication = () => (req, res, next) => {
    try {
        // 1. Extract token
        const authHeader = req.headers.authorization;
        console.log('header', authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        // 2. Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.access_token_secret);
        if (!decoded) {
            throw new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token');
        }
        console.log('decoded', decoded);
        // 4. Attach user to request
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error instanceof ApiErrot_1.default
            ? error
            : new ApiErrot_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized'));
    }
};
exports.authentication = authentication;
