import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'
import ApiError from '../helpers/ApiErrot'
import httpStatus from 'http-status'
import { getErrorMessage } from '../utils/getErrorMessage'
export function validator<T>(schema: ZodSchema<T>) {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const parsedData = schema.parse(req.body)
            req.body = parsedData
            next()
        } catch (error) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                getErrorMessage(error) || 'something went wrong'
            )
        }
    }
}
