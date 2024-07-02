import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Working on a project',
    description: 'The Task description'
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '123',
    description: 'User id'
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'Working on a project',
    description: 'The Task description'
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: false,
    description: 'Task completed indicator'
  })
  @IsBoolean()
  completed: boolean;
}
