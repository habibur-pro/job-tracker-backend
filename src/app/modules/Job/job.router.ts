import { Router } from 'express'
import JobController from './job.controller'

const router = Router()
router.post('/', JobController.addJob)
router.patch('/:jobId', JobController.updateJob)
router.get('/my-jobs', JobController.getMyJobs)
router.get('/:jobId', JobController.getSingleJob)
const JobRouter = router
export default JobRouter
