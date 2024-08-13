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
