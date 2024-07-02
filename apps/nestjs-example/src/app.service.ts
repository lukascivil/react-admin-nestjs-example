// Packages
import { Injectable } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';

@Resolver()
@Injectable()
export class AppService {
  @Query(() => [String])
  getAvailableResources(): Observable<Array<string>> {
    const resources: Array<string> = ['tasks', 'users', 'health'];

    return of(resources);
  }
}
