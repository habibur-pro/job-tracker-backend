export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
export enum JobType {
    FULLTIME = 'fullTime',
    PART_TIME = 'partTime',
    CONTRACTUAL = 'contractual',
}

export enum JobLocation {
    ONSITE = 'onsite',
    HYBRID = 'hybrid',
    REMOTE = 'remote',
}

export enum JobStatus {
    LISTED = 'listed',
    APPLIED = 'applied',
    INTERVIEW_SCHEDULED = 'interviewScheduled', // Interview scheduled
    INITIAL_INTERVIEW_COMPLETED = 'initialInterviewCompleted', // Interview scheduled
    INTERVIEW_COMPLETED = 'interviewCompleted', // Interview done
    JOB_TASK_ASSIGNED = 'jobTaskAssigned', // Task or assignment given
    OFFER_RECEIVED = 'offerReceived', // Job offer received
    REJECTED = 'rejected', // Application rejected
    CANCELED = 'canceled', // Application canceled
}
