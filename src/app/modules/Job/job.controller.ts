import httpStatus from 'http-status'
import sendResponse from '../../helpers/sendResponse'
import catchAsync from '../../helpers/asyncHandler'

import JobService from './job.service'

const addJob = catchAsync(async (req, res) => {
    const data = await JobService.addJob(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'job added successfully',
        data: data,
    })
})
const updateJob = catchAsync(async (req, res) => {
    const jobId = req.params.jobId
    const data = await JobService.updateJob(jobId, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'job updated successfully',
        data: data,
    })
})
const getMyJobs = catchAsync(async (req, res) => {
    const data = await JobService.getMyJobs(req)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'my jobs fetched successfully',
        data: data,
    })
})
const getSingleJob = catchAsync(async (req, res) => {
    const jobId = req.params.jobId
    const data = await JobService.getSingleJob(jobId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'job fetched successfully',
        data: data,
    })
})
const updateStatus = catchAsync(async (req, res) => {
    const jobId = req.params.jobId
    const data = await JobService.updateStatus(jobId, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'job status updated successfully',
        data: data,
    })
})

const JobController = {
    addJob,
    updateJob,
    getMyJobs,
    getSingleJob,
    updateStatus,
}
export default JobController
