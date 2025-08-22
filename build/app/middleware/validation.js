"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = validator;
const ApiErrot_1 = __importDefault(require("../helpers/ApiErrot"));
const http_status_1 = __importDefault(require("http-status"));
const getErrorMessage_1 = require("../utils/getErrorMessage");
function validator(schema) {
    return (req, _res, next) => {
        try {
            const parsedData = schema.parse(req.body);
            req.body = parsedData;
            next();
        }
        catch (error) {
            throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, (0, getErrorMessage_1.getErrorMessage)(error) || 'something went wrong');
        }
    };
}
