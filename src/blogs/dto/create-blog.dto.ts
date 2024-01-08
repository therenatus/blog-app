import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MaxLength(100)
  @IsUrl()
  @IsNotEmpty()
  websiteUrl: string;
}
