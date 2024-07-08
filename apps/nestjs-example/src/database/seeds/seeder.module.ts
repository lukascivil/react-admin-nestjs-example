// Packages
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserSeed } from './user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserSeed],
  exports: [UserSeed]
})
export class SeederModule {}
