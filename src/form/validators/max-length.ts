/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage, getSummaryErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'max-length';

/**
 * Error message.
 */
export const errorMessage: string = 'Must be less than %1 characters';

/**
 * Summary error message (supports %label% placeholder).
 */
export const summaryErrorMessage: string = '%label%: Must be less than %1 characters';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		// Get max length and value.
		const maxLength: number = parseInt( field.getAttribute( 'max-length' ) ?? '0' );
		const value: string = field.getField()?.value ?? '';

		// Validate.
		return '' === value || value.length <= maxLength;
	},
	getErrorMessage: ( field: TPFormFieldElement ): string => {
		// Get error message.
		const error: string = getErrorMessage( name );
		const maxLength: string = field.getAttribute( 'max-length' ) ?? '';

		// Return error message.
		return error.replace( '%1', maxLength );
	},
	getSummaryMessage: ( field: TPFormFieldElement ): string => {
		// Get summary message with label.
		const message = getSummaryErrorMessage( name, field );
		const maxLength: string = field.getAttribute( 'max-length' ) ?? '';

		// Replace %1 with max length value.
		return message.replace( '%1', maxLength );
	},
};
