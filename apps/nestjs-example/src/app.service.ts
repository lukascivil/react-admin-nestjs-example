// Packages
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { UserSeed } from './database/seeds/user.seeder';

@Resolver()
@Injectable()
export class AppService {
  constructor(private readonly userSeed: UserSeed) {}

  @Query(() => [String])
  getAvailableResources(): Observable<Array<string>> {
    const resources: Array<string> = ['tasks', 'users', 'health'];

    return of(resources);
  }

  onApplicationBootstrap(): any {
    // add a functionality to check if the data already exists, if not add it manually
    this.userSeed.run();
  }
}
