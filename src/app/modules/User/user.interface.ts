import { Types } from 'mongoose'
export interface IUser {
    id: string
    name: string
    email: string
    password: string
    photo: string
    jobProfile: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}
