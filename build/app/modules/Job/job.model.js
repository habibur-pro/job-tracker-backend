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
const JobSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'Job ID is required'],
        unique: true,
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    companyWebsite: {
        type: String,
        required: [true, 'Company website is required'],
        trim: true,
    },
    jobPostUrl: {
        type: String,
        required: [true, 'Job post URL is required'],
        trim: true,
    },
    salary: {
        type: String,
        required: [true, 'Offered salary is required'],
    },
    expectedSalary: {
        type: String,
        required: [true, 'Expected salary is required'],
    },
    deadline: {
        type: Date,
        required: [true, 'Application deadline is required'],
    },
    type: {
        type: String,
        enum: Object.values(enum_1.JobType),
        required: [true, 'Job type is required'],
    },
    location: {
        type: String,
        enum: Object.values(enum_1.JobLocation),
        required: [true, 'Job location is required'],
    },
    skills: {
        type: [String],
        required: [true, 'Required skills are needed'],
        default: [],
    },
    experience: {
        type: String,
        required: [true, 'Experience is required'],
    },
    details: {
        type: String,
        required: [true, 'Job details are required'],
    },
    status: {
        type: String,
        enum: Object.values(enum_1.JobStatus),
        default: enum_1.JobStatus.LISTED,
        required: [true, 'Job status is required'],
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: Object.values(enum_1.JobStatus),
                required: [true, 'Status is required in history'],
            },
            timeStamp: {
                type: Date,
                required: [true, 'Timestamp is required in history'],
            },
            note: {
                type: String,
                default: null,
            },
        },
    ],
    userId: {
        type: String,
        required: [true, 'userId is required'],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Associated user is required'],
    },
}, { timestamps: true });
JobSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.id) {
            this.id = yield (0, idGenerator_1.default)(this.constructor);
        }
        next();
    });
});
const Job = (0, mongoose_1.model)('job', JobSchema);
exports.default = Job;
