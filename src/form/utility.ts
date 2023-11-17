/**
 * Get the error message based on its code.
 *
 * @param {string} error Error code.
 *
 * @return {string} The error message.
 */
export const getErrorMessage = ( error: string = '' ): string => {
	const { tpFormErrors } = window;
	if ( ! tpFormErrors ) {
		return '';
	}

	if ( '' !== error && error in tpFormErrors && 'string' === typeof tpFormErrors[ error ] ) {
		return tpFormErrors[ error ];
	}

	return '';
};
