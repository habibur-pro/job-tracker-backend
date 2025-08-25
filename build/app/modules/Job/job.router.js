"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = __importDefault(require("./job.controller"));
const authentication_1 = require("../../helpers/authentication");
const router = (0, express_1.Router)();
router.post('/', job_controller_1.default.addJob);
router.patch('/:jobId/status', job_controller_1.default.updateStatus);
router.patch('/:jobId', job_controller_1.default.updateJob);
router.get('/', (0, authentication_1.authentication)(), job_controller_1.default.getMyJobs);
router.get('/:jobId', job_controller_1.default.getSingleJob);
const JobRouter = router;
exports.default = JobRouter;
