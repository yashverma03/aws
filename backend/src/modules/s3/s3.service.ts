import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generalResponse } from 'src/utils/response.util';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
      }
    });
  }

  async uploadFile(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const bucketName = 'aws-0001';
    const { originalname, buffer, mimetype } = file;
    const key = `${originalname}_${Date.now()}`;
    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype
    });

    try {
      await this.s3.send(command);
      return generalResponse('success', { fileUrl });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload file: ${error}`);
    }
  }
}
