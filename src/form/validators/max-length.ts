import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

export const name: string = 'max-length';
export const errorMessage: string = 'Must be less than %1 characters';
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		const minLength: number = parseInt( field.getAttribute( 'max-length' ) ?? '0' );
		const value: string = field.getField()?.value ?? '';

		return '' === value || value.length <= minLength;
	},
	getErrorMessage: ( field: TPFormFieldElement ): string => {
		const errorMessage: string = getErrorMessage( 'max-length' );
		const minLength: string = field.getAttribute( 'max-length' ) ?? '';

		return errorMessage.replace( '%1', minLength );
	},
};
