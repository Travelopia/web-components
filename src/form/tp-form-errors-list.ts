/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from './tp-form-field';

/**
 * TP Form Errors List.
 *
 * Displays the list of error links using tp-form-errors-error elements.
 */
export class TPFormErrorsListElement extends HTMLElement {
	/**
	 * Update the list with error links.
	 *
	 * @param {TPFormFieldElement[]} invalidFields Array of invalid form fields.
	 */
	update( invalidFields: TPFormFieldElement[] ): void {
		// Clear existing content.
		this.textContent = '';

		// Get validators for summary messages.
		const { tpFormValidators } = window;
		invalidFields.forEach( ( field: TPFormFieldElement ): void => {
			// Get field ID for the link.
			const inputField = field.getField();
			const fieldId = inputField?.id ?? '';

			// Skip if no field ID.
			if ( ! fieldId ) {
				// Bail.
				return;
			}

			// Get the error type from the field's error attribute.
			const errorType = field.getAttribute( 'error' ) ?? '';

			// Get the summary message.
			let message = '';

			// Check if we have everything.
			if ( errorType && tpFormValidators && errorType in tpFormValidators ) {
				const validator = tpFormValidators[ errorType ];

				// Try getSummaryMessage first, fall back to getErrorMessage.
				if ( 'function' === typeof validator.getSummaryMessage ) {
					message = validator.getSummaryMessage( field );
				} else if ( 'function' === typeof validator.getErrorMessage ) {
					message = validator.getErrorMessage( field );
				}
			}

			// Skip if no message.
			if ( ! message ) {
				// Bail.
				return;
			}

			// Create error element with link.
			const errorElement = document.createElement( 'tp-form-errors-error' );
			errorElement.setAttribute( 'role', 'listitem' );
			const link = document.createElement( 'a' );
			link.href = `#${ fieldId }`;
			link.textContent = message;
			errorElement.appendChild( link );
			this.appendChild( errorElement );
		} );
	}

	/**
	 * Clear the list.
	 */
	clear(): void {
		// Clear.
		this.textContent = '';
	}
}
