/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from './tp-form-field';

/**
 * Get the error message based on its code.
 *
 * @param {string} error Error code.
 *
 * @return {string} The error message.
 */
export const getErrorMessage = ( error: string = '' ): string => {
	// Check if tpFormErrors exist in the window object.
	const { tpFormErrors } = window;

	// If tpFormErrors does not exist.
	if ( ! tpFormErrors ) {
		// Return an empty string.
		return '';
	}

	// Check if the error exists and has a corresponding error message.
	if ( '' !== error && error in tpFormErrors && 'string' === typeof tpFormErrors[ error ] ) {
		// Return the error message.
		return tpFormErrors[ error ];
	}

	// Return an empty string.
	return '';
};

/**
 * Get the field label text.
 *
 * @param {TPFormFieldElement} field The form field element.
 *
 * @return {string} The label text or 'This field'.
 */
export const getFieldLabel = ( field: TPFormFieldElement ): string => {
	// Query for the label element.
	const label = field.querySelector( 'label' );

	// Return the label text or a fallback.
	return label?.textContent?.trim() || 'This field';
};

/**
 * Get the summary error message based on its code, with label substitution.
 *
 * @param {string}             error Error code.
 * @param {TPFormFieldElement} field The form field element.
 *
 * @return {string} The summary error message with %label% replaced.
 */
export const getSummaryErrorMessage = ( error: string = '', field: TPFormFieldElement ): string => {
	// Check if tpFormSummaryErrors exist in the window object.
	const { tpFormSummaryErrors } = window;

	// If tpFormSummaryErrors does not exist or error not found.
	if ( ! tpFormSummaryErrors || '' === error || ! ( error in tpFormSummaryErrors ) ) {
		// Return an empty string.
		return '';
	}

	// Get the message template.
	const template = tpFormSummaryErrors[ error ];

	// If not a string, return empty.
	if ( 'string' !== typeof template ) {
		// Return an empty string.
		return '';
	}

	// Get the field label.
	const label = getFieldLabel( field );

	// Replace %label% placeholder and return.
	return template.replace( '%label%', label );
};
