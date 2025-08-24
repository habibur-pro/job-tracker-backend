import { Document, Model, model, Schema } from 'mongoose'
import { IJob } from './job.interface'
import { JobLocation, JobStatus, JobType } from '../../enum'
import idGenerator from '../../helpers/idGenerator'

const JobSchema = new Schema<IJob>(
    {
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
        postImage: {
            type: String,
            default: '',
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
            enum: Object.values(JobType),
            required: [true, 'Job type is required'],
        },
        location: {
            type: String,
            enum: Object.values(JobLocation),
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
            enum: Object.values(JobStatus),
            default: JobStatus.LISTED,
            required: [true, 'Job status is required'],
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: Object.values(JobStatus),
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
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Associated user is required'],
        },
    },
    { timestamps: true }
)
JobSchema.pre<IJob>('validate', async function (next) {
    if (!this.id) {
        this.id = await idGenerator(this.constructor as Model<Document & IJob>)
    }
    next()
})
const Job = model<IJob>('job', JobSchema)
export default Job
