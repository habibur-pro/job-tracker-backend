// jobTitle,
// companyName,
// companyWebsite,
// jobPostUrl,
// postImage,
// salary,
// expectedSalary
// deadline,
// type: (full time, part time, contractual)
// location: (remote, hybrid, onsite)
// skils,
// experience
// details
// status
// statusHistory:[{status, timestamp, note }]

import { Types } from 'mongoose'
import { JobLocation, JobStatus, JobType } from '../../enum'

export interface IJob {
    id: string
    jobTitle: string
    companyName: string
    companyWebsite: string
    jobPostUrl: string
    postImage: string
    salary: string
    expectedSalary: string
    deadline: Date
    type: JobType
    location: JobLocation
    skills: Array<string>
    experience: string
    details: string
    status: JobStatus
    statusHistory: Array<{ status: JobStatus; timeStamp: Date; note: string }>
    userId: string
    user: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}
