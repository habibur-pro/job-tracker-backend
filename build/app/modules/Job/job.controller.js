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
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../helpers/sendResponse"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const job_service_1 = __importDefault(require("./job.service"));
const addJob = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield job_service_1.default.addJob(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'job added successfully',
        data: data,
    });
}));
const updateJob = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const data = yield job_service_1.default.updateJob(jobId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'job updated successfully',
        data: data,
    });
}));
const getMyJobs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield job_service_1.default.getMyJobs(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'my jobs fetched successfully',
        data: data,
    });
}));
const getSingleJob = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const data = yield job_service_1.default.getSingleJob(jobId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'job fetched successfully',
        data: data,
    });
}));
const updateStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const data = yield job_service_1.default.updateStatus(jobId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'job status updated successfully',
        data: data,
    });
}));
const JobController = {
    addJob,
    updateJob,
    getMyJobs,
    getSingleJob,
    updateStatus,
};
exports.default = JobController;
