// Packages
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';

// Services
import { TaskService } from './shared/services/task.service';
import { TaskEntity } from './shared/entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// Health
import { TasksHealth } from './tasks.health';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [TasksController],
  providers: [TaskService, TasksHealth],
  exports: [TasksHealth]
})
export class TasksModule {}
