import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskEntity } from 'src/tasks/shared/entity/task.entity';

// Models
import { GetListResult } from '../models/get-list-result.model';
import { GetManyResult } from '../models/get-many-result.model';
import { GetOneResult } from '../models/get-one-result.model';

type Data = GetListResult<TaskEntity> | GetManyResult<TaskEntity> | GetOneResult<TaskEntity>;
type Response<T> = T | Array<T>;

@Injectable()
export class ListPaginationInterceptor implements NestInterceptor<Data, Response<TaskEntity>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<TaskEntity>> {
    return next.handle().pipe(
      map((data: Data) => {
        if (!data.hasOwnProperty('contentRange')) {
          return data.data as TaskEntity;
        }

        const getListResult = data as GetListResult<TaskEntity>;
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const resource = getListResult.contentRange[0] || 'no-name';
        const start = getListResult.contentRange[1];
        const end = getListResult.contentRange[2];
        const total = getListResult.contentRange[3];
        const contentRange = `${resource} ${start}-${end}/${total}`;

        request.res.header('Access-Control-Expose-Headers', 'Content-Range');
        request.res.header('Content-Range', contentRange);

        return data.data as Array<TaskEntity>;
      })
    );
  }
}
