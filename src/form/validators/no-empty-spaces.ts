/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'no-empty-spaces';

/**
 * Error message.
 */
export const errorMessage: string = 'This field should not contain only whitespaces';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		const inputField = field.getField();

		if ( ! inputField ) {
			return false;
		}

		// This case is not our concern. This is handled by `required` validator.
		if ( '' === inputField.value ) {
			return true;
		}

		return '' !== inputField.value.trim();
	},
	getErrorMessage: (): string => getErrorMessage( name ),
};
