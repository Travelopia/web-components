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
		const value = field.getField()?.value ?? '';
		
		// International zip code pattern: letters, numbers, spaces, hyphens, 3-10 chars
		const zipCodeRegex = /^[A-Za-z0-9][A-Za-z0-9\- ]{1,8}[A-Za-z0-9]$/;
		
		return zipCodeRegex.test( value.trim() );
	},
	getErrorMessage: (): string => getErrorMessage( name ),
}; 