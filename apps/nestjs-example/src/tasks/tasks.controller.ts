// Packages
import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { TaskService } from './shared/services/task.service';
import { Observable, of } from 'rxjs';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { isArray } from 'class-validator';
import { DeleteResult } from 'typeorm';

// Models
import { GetListQuery } from 'src/shared/models/get-list-query.model';
import { GetOneResult } from 'src/shared/models/get-one-result.model';
import { GetListResult } from 'src/shared/models/get-list-result.model';
import { GetManyResult } from 'src/shared/models/get-many-result.model';

// Entity
import { TaskEntity } from './shared/entity/task.entity';

// Dtos
import { CreateTaskDto } from './shared/dto/create-task.dto';
import { UpdateTaskDto } from './shared/dto/update-task.dto';

// Interceptors
import { ListPaginationInterceptor } from 'src/shared/interceptors/list-pagination.interceptor';
import { CreateResult } from 'src/shared/models/create-result.model';
import { UpdateResult } from 'src/shared/models/update-result.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ListPaginationInterceptor)
export class TasksController {
  constructor(private taskService: TaskService) {}

  // GetList and GetMany
  @Get()
  @HttpCode(200)
  @ApiQuery({ type: '{key: string}', name: 'filter' })
  @ApiQuery({ type: '[number, number]', name: 'range', required: false })
  @ApiQuery({ type: '[number, number]', name: 'sort', required: false })
  @ApiOperation({
    summary: 'getList or getMany methods'
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Task records',
    type: TaskEntity
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  getAllWithQuery(
    @Query()
    getListQuery: GetListQuery
  ): Observable<GetListResult<TaskEntity> | GetManyResult<TaskEntity>> {
    const isInvalidQueryWithFilterId =
      getListQuery.filter.id && !isArray(getListQuery.filter.id) && !getListQuery.range && !getListQuery.sort;

    if (isInvalidQueryWithFilterId) {
      throw new HttpException('cafe', HttpStatus.BAD_REQUEST);
    }

    if (getListQuery.range && getListQuery.sort) {
      return this.taskService.getList(getListQuery);
    } else if (getListQuery.filter.id) {
      return this.taskService.getMany(getListQuery);
    }

    return of({ data: [], contentRange: ['error', 0, 9, 0] });
  }

  // GetOne
  @Get(':id')
  @HttpCode(200)
  getById(@Param('id', ParseIntPipe) id: number): Observable<GetOneResult<TaskEntity>> {
    return this.taskService.getOne(id);
  }

  // Create
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() task: CreateTaskDto): Observable<CreateResult<TaskEntity>> {
    return this.taskService.create(task);
  }

  // Update
  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() task: UpdateTaskDto): Observable<UpdateResult<TaskEntity>> {
    return this.taskService.update(id, task);
  }

  // Delete
  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number): Observable<DeleteResult> {
    return this.taskService.delete(id);
  }
}
