import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async run() {
    const user1 = new UserEntity();
    user1.name = 'John Doe';
    user1.email = 'john@example.com';
    user1.password = '123456';

    const user2 = new UserEntity();
    user2.name = 'Jane Doe';
    user2.email = 'jane@example.com';
    user2.password = '123456';

    try {
      const userExist = this.userRepository.find({ where: [{ email: user1.email }, { email: user2.email }] });

      if (userExist) {
        Logger.log('[SEED] Data already exists');
      } else {
        await this.userRepository.save([user1, user2]);

        Logger.log('[SEED] Data seeded successfully');
      }
    } catch (error) {
      Logger.error(`[SEED] Error seeding data: ${error.message}`, error.stack);
    }
  }
}
