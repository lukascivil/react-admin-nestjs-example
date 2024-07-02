// Packages
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { TasksHealth } from 'src/tasks/tasks.health';
import { UsersHealth } from 'src/users/users.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private usersHealth: UsersHealth,
    private tasksHealth: TasksHealth,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.usersHealth.isHealthy(),
      () => this.tasksHealth.isHealthy(),
      () => this.memoryHealthIndicator.checkHeap('memory', 150 * 1024 * 1024),
      () => this.db.pingCheck('database', { timeout: 100 })
    ]);
  }
}
