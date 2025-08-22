import { Router } from 'express'
import AuthRoutes from '../modules/Auth/auth.router'

const router = Router()
const routes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
]

routes.map((route) => router.use(route.path, route.route))

export default router
