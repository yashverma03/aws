import { IsNotEmpty, IsString } from 'class-validator';

export class GetObjectsDto {
   /**
   * The name of the S3 bucket from which to retrieve objects.
   * @example aws-0001
   */
  @IsString()
  @IsNotEmpty()
  bucketName: string;
}
