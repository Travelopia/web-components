/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'max-length';

/**
 * Error message.
 */
export const errorMessage: string = 'Must be less than %1 characters';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		// Get max length and value.
		const minLength: number = parseInt( field.getAttribute( 'max-length' ) ?? '0' );
		const value: string = field.getField()?.value ?? '';

		// Validate.
		return '' === value || value.length <= minLength;
	},
	getErrorMessage: ( field: TPFormFieldElement ): string => {
		// Get error message.
		const error: string = getErrorMessage( name );
		const maxLength: string = field.getAttribute( 'max-length' ) ?? '';

		// Return error message.
		return error.replace( '%1', maxLength );
	},
};
