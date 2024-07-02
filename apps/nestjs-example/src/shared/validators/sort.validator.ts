// Packages
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

type Order = 'DESC' | 'ASC';

@ValidatorConstraint()
export class SortValidator implements ValidatorConstraintInterface {
  validate(sort: [string, Order], validationArguments: ValidationArguments) {
    if (sort?.length !== 2) {
      return false;
    }

    return sort[1] === 'ASC' || sort[1] === 'DESC';
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return 'Invalid Sort parameter';
  }
}
