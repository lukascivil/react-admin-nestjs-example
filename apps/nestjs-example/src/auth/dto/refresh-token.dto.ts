// Packages
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDY2NzgyNjgsImV4cCI6MTYwNjY3OTE2OH0.RKxmYEuGJAMljsRk-WjWJwbM-IPwNaWzl9IXVykgWOY',
    description: 'Access Token with x minutes of expiration time'
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDY2NzgyNjgsImV4cCI6MTYwNjY4MDA2OH0.cx17qmoFXojZViEN0DQrtOXDgG718q3zECTVLBbcn88',
    description: 'Access Token with x + y minutes of expiration time'
  })
  @IsString()
  refresh_token: string;
}
