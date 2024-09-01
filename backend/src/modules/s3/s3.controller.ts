import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetObjectsDto } from './dto/get-objects.dto';

@ApiTags('s3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * Uploads a file to the S3 bucket.
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File | undefined) {
    return await this.s3Service.uploadObject(file);
  }

  /**
   * Retrieves a list of objects from the specified S3 bucket.
   */
  @Get()
  async getObjects(@Query() query: GetObjectsDto) {
    return await this.s3Service.getObjects(query.bucketName);
  }
}
