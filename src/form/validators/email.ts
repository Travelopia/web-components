/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'email';

/**
 * Error message.
 */
export const errorMessage: string = 'Please enter a valid email address';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		// Boolean value to determine if the field is valid or not.
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( field.getField()?.value ?? '' );
	},
	getErrorMessage: (): string => getErrorMessage( name ),
};
