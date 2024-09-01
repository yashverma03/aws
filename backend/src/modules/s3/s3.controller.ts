import {
  Controller,
  Get,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  Put
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('AWS S3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * Deletes a file from the S3 bucket.
   */
  @Delete(':fileName')
  async deleteObject(@Param('fileName') fileName: string) {
    return await this.s3Service.deleteObject(fileName);
  }

  /**
   * Retrieves a list of objects from the specified S3 bucket.
   */
  @Get()
  async getObjects() {
    return await this.s3Service.getObjects();
  }

  /**
   * Uploads a file to the S3 bucket.
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadObject(@UploadedFile() file: Express.Multer.File | undefined) {
    return await this.s3Service.uploadObject(file);
  }

  /**
   * Updates a existing file in the S3 bucket.
   */
  @Put(':fileName')
  @UseInterceptors(FileInterceptor('file'))
  async updateObject(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Param('fileName') fileName: string
  ) {
    return await this.s3Service.updateObject(file, fileName);
  }
}
