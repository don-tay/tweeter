import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { isEmpty } from 'lodash';
import { ErrorResponse } from './errorResponse';

/**
 * Validate an instance of a class against its constraints defined in its class definition
 * @param modelDefinition Class constructor of model
 * @param modelObject Instance of model
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function validateModel<T extends object>(modelDefinition: ClassConstructor<T>, modelObject: T): Promise<void> {
    const modelInstance = plainToClass(modelDefinition, modelObject);
    const errors = await validate(modelInstance);
    const uniqueErrors = [...new Set(errors.flatMap((obj) => Object.values(obj.constraints)))];

    if (!isEmpty(uniqueErrors)) {
        const errMsg = uniqueErrors.join('. ').trim() + '.';
        throw new ErrorResponse(errMsg, 400);
    }
}
