import ApiError from '../../helpers/ApiErrot'
import User from '../User/user.model'
import { IJob } from './job.interface'
import httpStatus from 'http-status'
import Job from './job.model'
import { Request } from 'express'
import { JobStatus } from '../../enum'
const addJob = async (payload: Partial<IJob> & { userId: string }) => {
    try {
        // console.log('payload is', payload)
        console.log(payload)
        const user = await User.findOne({ id: payload.userId })
        console.log('user', user)
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
        }
        await Job.create({ ...payload, user: user._id })
        return { message: 'job added' }
    } catch (error) {
        console.log('error is', error)
    }
}

const updateJob = async (jobId: string, payload: Partial<IJob>) => {
    const job = await Job.findOne({ id: jobId })
    if (!job) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'job not found')
    }
    if (payload.status) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'you cannot update status')
    }
    await Job.findOneAndUpdate({ id: jobId }, payload, { new: true })
    return { message: 'job updated' }
}

const updateStatus = async (
    jobId: string,
    payload: { status: JobStatus; note: string }
) => {
    const job = await Job.findOne({ id: jobId })
    if (!job) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'job not found')
    }

    if (job.status === payload.status) {
        // Update only last history entry (same status)
        await Job.findOneAndUpdate(
            { id: jobId, 'statusHistory.status': payload.status },
            {
                $set: {
                    'statusHistory.$.timeStamp': new Date(),
                    'statusHistory.$.note': payload.note,
                },
            },
            { new: true }
        )
    } else {
        // Push new history entry (different status)
        await Job.findOneAndUpdate(
            { id: jobId },
            {
                $push: {
                    statusHistory: {
                        status: payload.status,
                        timeStamp: new Date(),
                        note: payload.note,
                    },
                },
                $set: { status: payload.status },
            },
            { new: true }
        )
    }

    return { message: 'status updated' }
}

const getMyJobs = async (req: Request) => {
    const user = req.user
    console.log('user', user)
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'user not found')
    }

    const jobs = await Job.find({ userId: user.id })
    return jobs
}

const getSingleJob = async (jobId: string) => {
    const job = await Job.findOne({ id: jobId })
    return job
}

const JobService = {
    addJob,
    updateJob,
    getMyJobs,
    getSingleJob,
    updateStatus,
}
export default JobService
