import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayMaxSize, IsObject, Validate, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortValidator } from '../validators/sort.validator';
import { FilterValidator } from '../validators/filter.validator';

type Order = 'DESC' | 'ASC';

export class GetListQuery {
  @ApiProperty({
    type: Object,
    example: '{createdAt: "..."}'
  })
  @IsObject()
  @IsNotEmpty()
  @Transform(value => {
    return JSON.parse(value);
  })
  @Validate(FilterValidator)
  filter: { [key: string]: string } | { id: Array<number> };

  @ApiProperty({
    type: Array,
    example: '[0, 9]'
  })
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Transform(value => {
    return JSON.parse(value);
  })
  range?: [number, number];

  @ApiProperty({
    type: Array,
    example: '[createdAt, "ASC"]'
  })
  @IsOptional()
  @Transform(value => {
    return JSON.parse(value);
  })
  @Validate(SortValidator)
  sort?: [string, Order];
}
