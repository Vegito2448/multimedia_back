import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/index.ts";

export const uploadToCloudinary = async (file: Express.Multer.File) =>
  await new Promise<UploadApiResponse | undefined>((resolve) => {
    cloudinary.uploader.upload_stream((_error, uploadResult) => resolve(uploadResult)
    ).end(file.buffer);
  });

export const deleteFromCloudinary = async (publicId: string) => await cloudinary.uploader.destroy(publicId);