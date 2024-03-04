/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'required';

/**
 * Error message.
 */
export const errorMessage: string = 'This field is required';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		return '' !== field.getField()?.value.trim() ?? '';
	},
	getErrorMessage: (): string => getErrorMessage( name ),
};
