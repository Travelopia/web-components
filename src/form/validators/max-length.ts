import { TPFormFieldElement } from '../tp-form-field';
import { TPFormError, TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

export const MaxLengthValidator: TPFormValidator = {
	'max-length': {
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
	},
};

export const MaxLengthValidatorError: TPFormError = {
	'max-length': 'Must be less than %1 characters',
};
