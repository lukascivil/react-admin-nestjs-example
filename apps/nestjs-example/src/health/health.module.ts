// Packages
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';

// Health
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, UsersModule, TasksModule],
  controllers: [HealthController]
})
export class HealthModule {}
