import { Router } from 'express'
import AuthRoutes from '../modules/Auth/auth.router'
import JobRouter from '../modules/Job/job.router'

const router = Router()
const routes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/jobs',
        route: JobRouter,
    },
]

routes.map((route) => router.use(route.path, route.route))

export default router
