// Packages
import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { map, switchMap } from 'rxjs/operators';

// Models
import { GetListQuery } from 'src/shared/models/get-list-query.model';
import { GetOneResult } from 'src/shared/models/get-one-result.model';

// Entities
import { TaskEntity } from '../entity/task.entity';
import { GetListResult } from 'src/shared/models/get-list-result.model';
import { GetManyResult } from 'src/shared/models/get-many-result.model';
import { CreateResult } from 'src/shared/models/create-result.model';
import { UpdateResult } from 'src/shared/models/update-result.model';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>
  ) {}

  getList(getListQuery: GetListQuery): Observable<GetListResult<TaskEntity>> {
    const query: FindManyOptions<TaskEntity> = {
      where: { ...getListQuery.filter },
      take: getListQuery.range[1] - getListQuery.range[0] + 1,
      skip: getListQuery.range[0] === 0 ? 1 : getListQuery.range[0],
      order: { [getListQuery.sort[0]]: getListQuery.sort[1] }
    };

    return from(this.taskRepository.findAndCount(query)).pipe(
      map(el => {
        return {
          data: el[0],
          contentRange: ['tasks', getListQuery.range[0], getListQuery.range[1], el[1]]
        };
      })
    );
  }

  getMany(getListQuery: GetListQuery): Observable<GetManyResult<TaskEntity>> {
    const ids = typeof getListQuery.filter.id === 'string' ? [getListQuery.filter.id] : getListQuery.filter.id;

    return from(this.taskRepository.findByIds(ids)).pipe(
      map(savedTask => {
        return {
          data: savedTask
        };
      })
    );
  }

  getOne(id: number): Observable<GetOneResult<TaskEntity>> {
    const query: FindOneOptions<TaskEntity> = { where: { id } };

    return from(this.taskRepository.findOne(query)).pipe(
      map(savedTask => {
        return {
          data: savedTask
        };
      })
    );
  }

  create(task: CreateTaskDto): Observable<CreateResult<TaskEntity>> {
    const newTask = new TaskEntity();

    newTask.title = task.title;
    newTask.description = task.description;
    newTask.completed = task.completed;
    newTask.user_id = task.user_id;

    return from(this.taskRepository.save(newTask)).pipe(
      map(savedTask => {
        return {
          data: savedTask
        };
      })
    );
  }

  update(id, task: UpdateTaskDto): Observable<UpdateResult<TaskEntity>> {
    const query: FindOneOptions<TaskEntity> = { where: { id } };

    return from(this.taskRepository.findOne(query))
      .pipe(
        map(savedTask => {
          savedTask.title = task.title || savedTask.title;
          savedTask.description = task.description || savedTask.description;
          savedTask.completed = task.completed || savedTask.completed;

          return savedTask;
        }),
        switchMap(taskToUpdate => this.taskRepository.save(taskToUpdate))
      )
      .pipe(map(savedTask => ({ data: savedTask })));
  }

  delete(id: number): Observable<DeleteResult> {
    return from(this.taskRepository.delete({ id }));
  }
}
