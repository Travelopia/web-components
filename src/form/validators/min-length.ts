/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'min-length';

/**
 * Error message.
 */
export const errorMessage: string = 'Must be at least %1 characters';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		// Get min length and value.
		const minLength: number = parseInt( field.getAttribute( 'min-length' ) ?? '0' );
		const value: string = field.getField()?.value ?? '';

		// Validate.
		return '' === value || value.length >= minLength;
	},
	getErrorMessage: ( field: TPFormFieldElement ): string => {
		// Get error message.
		const error: string = getErrorMessage( name );
		const minLength: string = field.getAttribute( 'min-length' ) ?? '';

		// Return error message.
		return error.replace( '%1', minLength );
	},
};
