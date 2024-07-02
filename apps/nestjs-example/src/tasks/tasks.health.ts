// Packages
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicator, HealthCheckError } from '@nestjs/terminus';

// Services
import { TaskService } from './shared/services/task.service';

@Injectable()
export class TasksHealth extends HealthIndicator {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const tasks = await this.taskService
      .getList({ filter: {}, range: [0, 0], sort: ['created_at', 'ASC'] })
      .toPromise();
    const isHealthy = tasks.data !== undefined;
    const result = this.getStatus('tasks', isHealthy, { getList: 'Is working' });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Tasks health check failed', result);
  }
}
