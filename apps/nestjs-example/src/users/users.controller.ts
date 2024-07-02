// Packages
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UsePipes,
  UseGuards,
  Query,
  HttpStatus,
  HttpException,
  UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable, of } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { isArray } from 'class-validator';

// Entities
import { UserEntity } from './entities/user.entity';

// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Models
import { GetOneResult } from 'src/shared/models/get-one-result.model';
import { CreateResult } from 'src/shared/models/create-result.model';
import { GetListQuery } from 'src/shared/models/get-list-query.model';
import { GetListResult } from 'src/shared/models/get-list-result.model';
import { GetManyResult } from 'src/shared/models/get-many-result.model';
import { UpdateResult } from 'src/shared/models/update-result.model';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// Interceptors
import { ListPaginationInterceptor } from 'src/shared/interceptors/list-pagination.interceptor';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ListPaginationInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GetList and GetMany
  @Get()
  @ApiQuery({ type: '{key: string}', name: 'filter' })
  @ApiQuery({ type: '[number, number]', name: 'range', required: false })
  @ApiQuery({ type: '[number, number]', name: 'sort', required: false })
  @ApiOperation({
    summary: 'getList or getMany methods'
  })
  @ApiResponse({
    status: 200,
    description: 'A list of User records',
    type: UserEntity
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  getAllWithQuery(
    @Query()
    getListQuery: GetListQuery
  ): Observable<GetListResult<UserEntity> | GetManyResult<UserEntity>> {
    const isInvalidQueryWithFilterId =
      getListQuery.filter.id && !isArray(getListQuery.filter.id) && !getListQuery.range && !getListQuery.sort;

    if (isInvalidQueryWithFilterId) {
      throw new HttpException('cafe', HttpStatus.BAD_REQUEST);
    }

    if (getListQuery.range && getListQuery.sort) {
      return this.usersService.getList(getListQuery);
    } else if (getListQuery.filter.id) {
      return this.usersService.getMany(getListQuery);
    }

    return of({ data: [], contentRange: ['error', 0, 9, 0] });
  }

  // GetOne
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Observable<GetOneResult<UserEntity>> {
    return this.usersService.getOne(id);
  }

  // Create
  // @UseGuards(AuthGuard('local'))
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() task: CreateUserDto): Observable<CreateResult<UserEntity>> {
    return this.usersService.create(task);
  }

  // Create1M
  // @UseGuards(AuthGuard('local'))
  // @Post()
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // async create1M(@Body() task: CreateUserDto): Promise<CreateResult<UserEntity>> {
  //   let user: CreateResult<UserEntity>;

  //   for (let index = 100; index < 1000000; index++) {
  //     const newTask: CreateUserDto = { ...task };
  //     newTask.email = `${index}${newTask.email}`;

  //     user = await this.usersService.create(newTask).toPromise();
  //   }

  //   return user;
  // }

  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Observable<UpdateResult<UserEntity>> {
    return this.usersService.update(id, updateUserDto);
  }

  // Delete
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Observable<DeleteResult> {
    return this.usersService.delete(id);
  }
}
