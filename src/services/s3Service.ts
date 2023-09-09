import { S3 } from "aws-sdk";
const uuid = require('uuid').v4;

interface UploadParams {
    Bucket: string;
    Key: string;
    Body: Buffer;
  }
  

const s3Uploadv2 = async (files: Express.Multer.File[]) => {
    const s3 = new S3();

    const params: UploadParams[] = files.map((file) => {
        return {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `uploads/${uuid()}-${file.originalname}`,
          Body: file.buffer,
        };
      });

    return await Promise.all(params.map((param) => s3.upload(param).promise()));
}


export default s3Uploadv2;
