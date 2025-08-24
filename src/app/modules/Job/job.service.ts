import ApiError from '../../helpers/ApiErrot'
import User from '../User/user.model'
import { IJob } from './job.interface'
import httpStatus from 'http-status'
import Job from './job.model'
import { Request } from 'express'
const addJob = async (payload: Partial<IJob> & { userId: string }) => {
    const user = await User.findOne({ id: payload.userId })
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
    }
    await Job.create({ ...payload, user: user._id })
    return { message: 'job added' }
}

const updateJob = async (jobId: string, payload: Partial<IJob>) => {
    const job = await Job.findOne({ id: jobId })
    if (!job) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'job not found')
    }

    await Job.findOneAndUpdate({ id: jobId }, payload, { new: true })
    return { message: 'job updated' }
}

const getMyJobs = async (req: Request) => {
    const user = req.user
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'user not found')
    }

    await Job.find({ userId: user.id })
    return { message: 'job updated' }
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
}
export default JobService
