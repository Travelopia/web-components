import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

export const name: string = 'required';
export const errorMessage: string = 'This field is required';
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		return '' !== field.getField()?.value ?? '';
	},
	getErrorMessage: (): string => getErrorMessage( 'required' ),
};
