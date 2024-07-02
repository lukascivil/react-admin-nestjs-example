// Packages
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Models
import { AppEntity } from 'src/shared/models/app-entity.model';
import { UserEntity } from 'src/users/entities/user.entity';

const entityName: AppEntity = 'task';

@Entity(entityName)
export class TaskEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 10,
    description: 'Record Id'
  })
  id?: number;

  @Column({ nullable: false })
  @ManyToOne(() => UserEntity, {
    nullable: false
  })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column({ nullable: false })
  updated_by: number;

  @Column({ type: 'longtext', default: '' })
  @ApiProperty({
    example: 'Working on a project with react-admin and nestjs',
    description: 'The Task description'
  })
  description: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    example: false,
    description: 'Is my Task completed'
  })
  completed: boolean;

  @Column({ type: 'text', default: '' })
  @ApiProperty({
    example: 'I have to study react-admin and nestjs',
    description: 'Task title'
  })
  title: string;

  @Column({ type: 'datetime', default: () => 'NOW()' })
  @ApiProperty({
    example: 'YYYY-MM-DD HH-MM-SS',
    description: 'when this task was created'
  })
  created_at: string;

  @Column({ type: 'datetime', default: () => 'NOW()' })
  @ApiProperty({
    example: 'YYYY-MM-DD HH-MM-SS',
    description: 'when this task was updated'
  })
  updated_at: string;
}
