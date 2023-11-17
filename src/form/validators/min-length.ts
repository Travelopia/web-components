import { TPFormFieldElement } from '../tp-form-field';
import { TPFormError, TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

export const MinLengthValidator: TPFormValidator = {
	'min-length': {
		validate: ( field: TPFormFieldElement ): boolean => {
			const minLength: number = parseInt( field.getAttribute( 'min-length' ) ?? '0' );
			const value: string = field.getField()?.value ?? '';

			return '' === value || value.length >= minLength;
		},
		getErrorMessage: ( field: TPFormFieldElement ): string => {
			const errorMessage: string = getErrorMessage( 'min-length' );
			const minLength: string = field.getAttribute( 'min-length' ) ?? '';

			return errorMessage.replace( '%1', minLength );
		},
	},
};

export const MinLengthValidatorError: TPFormError = {
	'min-length': 'Must be at least %1 characters',
};
