import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export interface IFile {
  uri: string;
  name: string;
  type: string;
}

export const mapFiles = async (files: any) => {
  let fls: IFile[] = [];

  if (files && files?.length > 0) {
    for await (let file of files) {
      fls.push({
        name: file?.name,
        type: file?.type,
        uri: file?.uri.includes("res.cloudinary.com")
          ? file?.uri
          : await upLoadFiles(file?.uri, file?.name),
      });
    }
  }

  return fls;
};

export const upLoadFiles = async (file: any, fileName?: any) => {
  const uri = await cloudinary.uploader.upload(file, { public_id: fileName });

  return uri?.secure_url as string;
};
