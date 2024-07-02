// Packages
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Resolver, Query, Args } from '@nestjs/graphql';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Models
import { CreateResult } from 'src/shared/models/create-result.model';
import { GetOneResult } from 'src/shared/models/get-one-result.model';

// Entities
import { UserEntity } from './entities/user.entity';
import { UpdateResult } from 'src/shared/models/update-result.model';
import { GetListQuery } from 'src/shared/models/get-list-query.model';
import { GetListResult } from 'src/shared/models/get-list-result.model';
import { GetManyResult } from 'src/shared/models/get-many-result.model';

@Resolver()
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  @Query(() => [UserEntity])
  getList(getListQuery: GetListQuery): Observable<GetListResult<UserEntity>> {
    const query: FindManyOptions<UserEntity> = {
      where: { ...getListQuery.filter },
      take: getListQuery.range[1] - getListQuery.range[0] + 1,
      skip: getListQuery.range[0] === 0 ? 1 : getListQuery.range[0],
      order: { [getListQuery.sort[0]]: getListQuery.sort[1] }
    };

    return from(this.userRepository.findAndCount(query)).pipe(
      map(el => {
        return {
          data: el[0],
          contentRange: ['users', getListQuery.range[0], getListQuery.range[1], el[1]]
        };
      })
    );
  }

  getMany(getListQuery: GetListQuery): Observable<GetManyResult<UserEntity>> {
    const ids = typeof getListQuery.filter.id === 'string' ? [getListQuery.filter.id] : getListQuery.filter.id;

    return from(this.userRepository.findByIds(ids)).pipe(
      map(savedUser => {
        return {
          data: savedUser
        };
      })
    );
  }

  getOneByEmail(email: string): Observable<GetOneResult<UserEntity | undefined>> {
    const query: FindOneOptions<UserEntity> = { where: { email } };

    return from(this.userRepository.findOne(query)).pipe(
      map((savedUser: UserEntity | undefined) => {
        return {
          data: savedUser
        };
      })
    );
  }

  @Query(() => UserEntity)
  getOne(@Args('id') id: number): Observable<GetOneResult<UserEntity | undefined>> {
    const query: FindOneOptions<UserEntity> = { where: { id } };

    return from(this.userRepository.findOne(query)).pipe(
      map((savedUser: UserEntity | undefined) => {
        return {
          data: savedUser
        };
      })
    );
  }

  create(createUserDto: CreateUserDto): Observable<CreateResult<UserEntity>> {
    const newUser = new UserEntity();

    newUser.name = createUserDto.name;
    newUser.password = createUserDto.password;
    newUser.email = createUserDto.email;
    newUser.birthdate = createUserDto.birthdate;

    return from(this.getOneByEmail(createUserDto.email)).pipe(
      switchMap(savedUser => {
        return savedUser.data?.email
          ? throwError(new HttpException('Email already exist', HttpStatus.BAD_REQUEST))
          : from(this.userRepository.save(newUser));
      }),
      switchMap(savedUser => {
        return of({ data: savedUser });
      })
    );
  }

  update(id: number, updateUserDto: UpdateUserDto): Observable<UpdateResult<UserEntity>> {
    const query: FindOneOptions<UserEntity> = { where: { id } };

    return from(this.userRepository.findOne(query))
      .pipe(
        map(savedUser => {
          savedUser.birthdate = updateUserDto.birthdate || savedUser.birthdate;
          savedUser.name = updateUserDto.name || savedUser.name;
          savedUser.email = updateUserDto.email || savedUser.email;
          savedUser.birthdate = updateUserDto.birthdate || savedUser.birthdate;
          savedUser.password = updateUserDto.password || savedUser.password;
          savedUser.updated_at = new Date().toISOString();

          return savedUser;
        }),
        switchMap(userToUpdate => this.userRepository.save(userToUpdate))
      )
      .pipe(map(savedUser => ({ data: savedUser })));
  }

  delete(id: number): Observable<DeleteResult> {
    return from(this.userRepository.delete({ id }));
  }
}
