// Packages
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicator, HealthCheckError } from '@nestjs/terminus';

// Services
import { UsersService } from './users.service';

@Injectable()
export class UsersHealth extends HealthIndicator {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const user = await this.usersService.getOne(9).toPromise();
    const isHealthy = user.data !== undefined;
    const result = this.getStatus('users', isHealthy, { getList: 'Is working' });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Users health check failed', result);
  }
}
