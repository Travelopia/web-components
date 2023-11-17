import { TPFormFieldElement } from '../tp-form-field';
import { TPFormError, TPFormValidator } from '../definitions';

export const MinLengthValidator: TPFormValidator = {
	'min-length': ( field: TPFormFieldElement ): boolean => {
		const minLength: number = parseInt( field.getAttribute( 'min-length' ) ?? '0' );
		const value: string = field.getField()?.value ?? '';

		return '' === value || value.length > minLength;
	},
};

export const MinLengthValidatorError: TPFormError = {
	'min-length': 'Must not be less than %1 characters',
};
