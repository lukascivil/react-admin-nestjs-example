import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    example: 10,
    description: 'Record Id'
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Working on a project',
    description: 'The Task description'
  })
  @IsString()
  title: string;

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

  @ApiProperty({
    example: 'YYYY-MM-DD HH-MM-SS',
    description: 'when this task was created'
  })
  created_at: string;

  @ApiProperty({
    example: 'YYYY-MM-DD HH-MM-SS',
    description: 'when this task was updated'
  })
  updated_at: string;
}
