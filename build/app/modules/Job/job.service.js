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
const ApiErrot_1 = __importDefault(require("../../helpers/ApiErrot"));
const user_model_1 = __importDefault(require("../User/user.model"));
const http_status_1 = __importDefault(require("http-status"));
const job_model_1 = __importDefault(require("./job.model"));
const addJob = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('payload is', payload)
        console.log(payload);
        const user = yield user_model_1.default.findOne({ id: payload.userId });
        console.log('user', user);
        if (!user) {
            throw new ApiErrot_1.default(http_status_1.default.NOT_FOUND, 'user not found');
        }
        yield job_model_1.default.create(Object.assign(Object.assign({}, payload), { user: user._id }));
        return { message: 'job added' };
    }
    catch (error) {
        console.log('error is', error);
    }
});
const updateJob = (jobId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.default.findOne({ id: jobId });
    if (!job) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'job not found');
    }
    if (payload.status) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'you cannot update status');
    }
    yield job_model_1.default.findOneAndUpdate({ id: jobId }, payload, { new: true });
    return { message: 'job updated' };
});
const updateStatus = (jobId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.default.findOne({ id: jobId });
    if (!job) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'job not found');
    }
    if (job.status === payload.status) {
        // Update only last history entry (same status)
        yield job_model_1.default.findOneAndUpdate({ id: jobId, 'statusHistory.status': payload.status }, {
            $set: {
                'statusHistory.$.timeStamp': new Date(),
                'statusHistory.$.note': payload.note,
            },
        }, { new: true });
    }
    else {
        // Push new history entry (different status)
        yield job_model_1.default.findOneAndUpdate({ id: jobId }, {
            $push: {
                statusHistory: {
                    status: payload.status,
                    timeStamp: new Date(),
                    note: payload.note,
                },
            },
            $set: { status: payload.status },
        }, { new: true });
    }
    return { message: 'status updated' };
});
const getMyJobs = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    console.log('user', user);
    if (!user) {
        throw new ApiErrot_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    const jobs = yield job_model_1.default.find({ userId: user.id });
    return jobs;
});
const getSingleJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.default.findOne({ id: jobId });
    return job;
});
const JobService = {
    addJob,
    updateJob,
    getMyJobs,
    getSingleJob,
    updateStatus,
};
exports.default = JobService;
