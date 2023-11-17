import { TPFormFieldElement } from '../tp-form-field';
import { TPFormError, TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

export const RequiredValidator: TPFormValidator = {
	required: {
		validate: ( field: TPFormFieldElement ): boolean => {
			return '' !== field.getField()?.value ?? '';
		},
		getErrorMessage: (): string => getErrorMessage( 'required' ),
	},
};

export const RequiredValidatorError: TPFormError = {
	required: 'This field is required',
}
