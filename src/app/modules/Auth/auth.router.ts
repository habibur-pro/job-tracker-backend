import { Router } from 'express'
import AuthController from './auth.controller'

const router = Router()
router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signIn)
router.post('/verify-signin', AuthController.verifySignin)
router.post('/auto-signin', AuthController.autoSignin)
router.post('/refresh', AuthController.refreshToken)
const AuthRoutes = router
export default AuthRoutes
