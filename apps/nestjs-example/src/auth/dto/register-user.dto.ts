import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'Luiz cafeina pura',
    description: 'User name'
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'cafe@gmail.com',
    description: 'User email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456789',
    description: 'User password'
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 28,
    description: 'User age'
  })
  @IsDateString()
  birthdate: string;
}
