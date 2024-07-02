// Packages
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

// Entity
import { AppEntity } from 'src/shared/models/app-entity.model';

const entityName: AppEntity = 'user';

@ObjectType()
@Entity(entityName)
export class UserEntity {
  @Field()
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 10,
    description: 'Record Id'
  })
  id?: number;

  @Field()
  @Column({ type: 'longtext', default: '' })
  @ApiProperty({
    example: 'Working on a project with react-admin and nestjs',
    description: 'The Task description'
  })
  name: string;

  @Field()
  @Column({ type: 'datetime', default: () => 'NOW()' })
  @ApiProperty({
    example: 28,
    description: 'User age'
  })
  birthdate: string;

  @Field()
  @Column({ type: 'varchar', unique: true, length: 256, nullable: false })
  @ApiProperty({
    example: 'cafe@gmail.com',
    description: 'User email'
  })
  email: string;

  @Field()
  @Column({ type: 'text', default: '' })
  @ApiProperty({
    example: '123456',
    description: 'User password'
  })
  password: string;

  @Field()
  @Column({ type: 'datetime', default: () => 'NOW()' })
  @ApiProperty({
    example: 'YYYY-MM-DD HH-MM-SS',
    description: 'when this user was created'
  })
  created_at: string;

  @Field()
  @Column({ type: 'datetime', default: () => 'NOW()' })
  @ApiProperty({
    example: 'YYYY-MM-DD HH-MM-SS',
    description: 'when this user was updated'
  })
  updated_at: string;
}
