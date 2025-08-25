import { Router } from 'express'
import JobController from './job.controller'
import { cloudinaryUploader } from '../../helpers/cloudinaryUploader'
import { authentication } from '../../helpers/authentication'
import { UserRole } from '../../enum'

const router = Router()
router.post('/', JobController.addJob)
router.patch('/:jobId/status', JobController.updateStatus)
router.patch('/:jobId', JobController.updateJob)
router.get('/', authentication(), JobController.getMyJobs)
router.get('/:jobId', JobController.getSingleJob)
const JobRouter = router
export default JobRouter
