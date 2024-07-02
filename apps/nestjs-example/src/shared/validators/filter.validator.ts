// Packages
import {
  isEmpty,
  isObject,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint()
export class FilterValidator implements ValidatorConstraintInterface {
  validate(filter: { [key: string]: string } | { id: Array<string> }, validationArguments: ValidationArguments) {
    if (filter?.hasOwnProperty('id')) {
      return true;
    }

    return isObject(filter) && !isEmpty(filter);
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return 'Invalid Filter parameter';
  }
}
