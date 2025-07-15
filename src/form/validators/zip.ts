/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'zip';

/**
 * Error message.
 */
export const errorMessage: string = 'Please enter a valid zip code';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		// Get the field value or default to empty string.
		const value = field.getField()?.value ?? '';

		// Get custom regex pattern from zip-pattern attribute or use default.
		const customPattern: string | null = field.getAttribute( 'zip-pattern' );
		const defaultPattern: string = '^[A-Za-z0-9][A-Za-z0-9\\- ]{1,8}[A-Za-z0-9]$';
		const pattern: string = customPattern ?? defaultPattern;

		// Create regex object from pattern.
		const zipCodeRegex: RegExp = new RegExp( pattern );

		// Test the trimmed value against the regex pattern.
		return zipCodeRegex.test( value.trim() );
	},
	getErrorMessage: (): string => getErrorMessage( name ),
};
