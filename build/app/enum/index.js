"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStatus = exports.JobLocation = exports.JobType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var JobType;
(function (JobType) {
    JobType["FULLTIME"] = "fullTime";
    JobType["PART_TIME"] = "partTime";
    JobType["CONTRACTUAL"] = "contractual";
})(JobType || (exports.JobType = JobType = {}));
var JobLocation;
(function (JobLocation) {
    JobLocation["ONSITE"] = "onsite";
    JobLocation["HYBRID"] = "hybrid";
    JobLocation["REMOTE"] = "remote";
})(JobLocation || (exports.JobLocation = JobLocation = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["LISTED"] = "listed";
    JobStatus["APPLIED"] = "applied";
    JobStatus["INTERVIEW_SCHEDULED"] = "interviewScheduled";
    JobStatus["INITIAL_INTERVIEW_COMPLETED"] = "initialInterviewCompleted";
    JobStatus["INTERVIEW_COMPLETED"] = "interviewCompleted";
    JobStatus["JOB_TASK_ASSIGNED"] = "jobTaskAssigned";
    JobStatus["OFFER_RECEIVED"] = "offerReceived";
    JobStatus["REJECTED"] = "rejected";
    JobStatus["CANCELED"] = "canceled";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
