/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage, getSummaryErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'no-empty-spaces';

/**
 * Error message.
 */
export const errorMessage: string = 'This field should not contain only white-spaces';

/**
 * Summary error message (supports %label% placeholder).
 */
export const summaryErrorMessage: string = '%label%: Should not contain only white-spaces';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	validate: ( field: TPFormFieldElement ): boolean => {
		// Check if the field is empty.
		const inputField = field.getField();

		// If no field is found return false.
		if ( ! inputField ) {
			// Return false.
			return false;
		}

		// This case is not our concern. This is handled by `required` validator.
		if ( '' === inputField.value ) {
			// Return true.
			return true;
		}

		// Return true if field is not empty.
		return '' !== inputField.value.trim();
	},
	getErrorMessage: (): string => getErrorMessage( name ),
	getSummaryMessage: ( field: TPFormFieldElement ): string => getSummaryErrorMessage( name, field ),
};
