import { TPFormFieldElement } from '../tp-form-field';
import { TPFormError, TPFormValidator } from '../definitions';

export const RequiredValidator: TPFormValidator = {
	required: ( field: TPFormFieldElement ): boolean => {
		return '' !== field.getField()?.value ?? '';
	},
};

export const RequiredValidatorError: TPFormError = {
	required: 'This field is required',
}
