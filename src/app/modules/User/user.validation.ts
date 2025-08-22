import { z } from 'zod'
export const signUpValidationSchema = z.object({
    name: z.string().nonempty('name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})
