import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(10)
  @MinLength(3)
  @IsNotEmpty()
  login: string;

  @MaxLength(20)
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Matches("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$")
  email: string;
}
