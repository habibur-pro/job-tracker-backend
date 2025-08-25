import { Document, Model, model, Schema } from 'mongoose'
import { IUser } from './user.interface'
import idGenerator from '../../helpers/idGenerator'
import { UserRole } from '../../enum'
const UserSchema = new Schema<IUser>(
    {
        id: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            default: null,
        },
        photo: {
            type: String,
            default: null,
        },
        jobProfile: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'job-profile',
        },
    },
    {
        timestamps: true,
    }
)
UserSchema.pre<IUser>('validate', async function (next) {
    if (!this.id) {
        this.id = await idGenerator(this.constructor as Model<Document & IUser>)
    }
    next()
})
const User = model<IUser>('user', UserSchema)
export default User
