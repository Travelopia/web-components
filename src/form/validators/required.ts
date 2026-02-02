/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from '../tp-form-field';
import { TPFormValidator } from '../definitions';
import { getErrorMessage, getSummaryErrorMessage } from '../utility';

/**
 * Name.
 */
export const name: string = 'required';

/**
 * Error message.
 */
export const errorMessage: string = 'This field is required';

/**
 * Summary error message (supports %label% placeholder).
 */
export const summaryErrorMessage: string = '%label%: This field is required';

/**
 * Validator.
 */
export const validator: TPFormValidator = {
	// Validate.
	validate: ( field: TPFormFieldElement ): boolean => {
		// Check if the field is empty.
		return '' !== ( field.getField()?.value ?? '' );
	},
	getErrorMessage: (): string => getErrorMessage( name ),
	getSummaryMessage: ( field: TPFormFieldElement ): string => getSummaryErrorMessage( name, field ),
};
