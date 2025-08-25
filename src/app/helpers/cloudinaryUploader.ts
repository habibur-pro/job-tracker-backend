/* eslint-disable @typescript-eslint/no-namespace */
import multer from 'multer'
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import cloudinary from '../config/cloudinaryConfig'

// ✅ Extend Express Request to include uploadedFiles
declare global {
    namespace Express {
        interface Request {
            uploadedFiles?: {
                [key: string]: {
                    // key will be the field name
                    filename: string
                    extension: string
                    size: number // in bytes
                    url: string
                }
            }
        }
    }
}

// ✅ Multer memory storage (for buffer)
const storage = multer.memoryStorage()
const upload = multer({ storage })

// ✅ Upload a buffer to Cloudinary
const uploadToCloudinary = async (
    fileBuffer: Buffer,
    mimetype: string,
    folder = 'job-tracker'
): Promise<string> => {
    const base64 = `data:${mimetype};base64,${fileBuffer.toString('base64')}`
    const result = await cloudinary.uploader.upload(base64, {
        folder,
        resource_type: 'auto',
    })
    return result.secure_url
}

/**
 * ✅ Reusable Cloudinary uploader middleware
 * @param fields Array of field names you want to upload
 * @param folder Cloudinary folder to save files
 */
export const cloudinaryUploader = (
    fields: string[] = ['file'],
    folder: string = 'job-tracker'
) => {
    const multerHandler = upload.fields(
        fields.map((name) => ({ name, maxCount: 1 }))
    )

    return async (req: Request, res: Response, next: NextFunction) => {
        multerHandler(req, res, async (err: any) => {
            if (err) return res.status(400).json({ error: err.message })

            try {
                const uploadedFiles: Record<string, any> = {}

                for (const fieldName of fields) {
                    const fileArray = (req.files as any)?.[fieldName]
                    if (fileArray && fileArray.length > 0) {
                        const file = fileArray[0]
                        const url = await uploadToCloudinary(
                            file.buffer,
                            file.mimetype,
                            folder
                        )
                        const extension = path
                            .extname(file.originalname)
                            .replace('.', '')

                        uploadedFiles[fieldName] = {
                            filename: file.originalname,
                            extension,
                            size: file.size,
                            url,
                        }
                    }
                }

                req.uploadedFiles = uploadedFiles
                next()
            } catch (uploadErr) {
                console.error('Cloudinary upload failed:', uploadErr)
                res.status(500).json({ error: 'Cloudinary upload failed' })
            }
        })
    }
}
