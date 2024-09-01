import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generalResponse, getResponse } from 'src/utils/response.util';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucketName;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
      }
    });
    this.bucketName = 'aws-0001';
  }

  async uploadObject(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const { originalname, buffer, mimetype } = file;
    const key = `${originalname}_${Date.now()}`;
    const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype
    });

    try {
      await this.s3.send(command);
      return generalResponse('uploaded', { fileUrl });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload file: ${error}`);
    }
  }

  async getObjects() {
    const command = new ListObjectsV2Command({ Bucket: this.bucketName });

    try {
      const { Contents } = await this.s3.send(command);
      const files: string[] =
        Contents?.map((item) => `https://${this.bucketName}.s3.amazonaws.com/${item.Key}`) || [];
      return getResponse({ files });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get objects: ${error}`);
    }
  }

  async updateObject(file: Express.Multer.File | undefined, oldFileName: string) {
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const { originalname, buffer, mimetype } = file;
    const newKey = `${originalname}_${Date.now()}`;

    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: oldFileName
    });

    const putCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: newKey,
      Body: buffer,
      ContentType: mimetype
    });

    try {
      // Delete the old file
      await this.s3.send(deleteCommand);
      // Upload the new file
      await this.s3.send(putCommand);
      const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${newKey}`;
      return generalResponse('updated', { fileUrl });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update file: ${error}`);
    }
  }

  async deleteObject(fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName
    });

    try {
      await this.s3.send(command);
      return generalResponse('deleted', { fileName });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete file: ${error}`);
    }
  }
}
