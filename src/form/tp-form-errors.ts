/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from './tp-form-field';
import { TPFormErrorsHeadingElement } from './tp-form-errors-heading';
import { TPFormErrorsListElement } from './tp-form-errors-list';

/**
 * TP Form Errors.
 */
export class TPFormErrorsElement extends HTMLElement {
	/**
	 * Update the error summary with the given invalid fields.
	 *
	 * @param {TPFormFieldElement[]} invalidFields Array of invalid form fields.
	 */
	update( invalidFields: TPFormFieldElement[] ): void {
		// Get child components.
		const heading = this.querySelector( 'tp-form-errors-heading' ) as TPFormErrorsHeadingElement | null;
		const list = this.querySelector( 'tp-form-errors-list' ) as TPFormErrorsListElement | null;

		// If no errors, remove active state.
		if ( 0 === invalidFields.length ) {
			this.removeAttribute( 'active' );
			this.removeAttribute( 'tabindex' );
			heading?.update( 0 );
			list?.clear();

			// Bail early.
			return;
		}

		// Set active state and make focusable.
		this.setAttribute( 'active', 'yes' );
		this.setAttribute( 'tabindex', '-1' );

		// Update child components.
		heading?.update( invalidFields.length );
		list?.update( invalidFields );
	}

	/**
	 * Clear the error summary.
	 */
	clear(): void {
		// Clear attributes.
		this.removeAttribute( 'active' );
		this.removeAttribute( 'tabindex' );

		// Get heading and list.
		const heading = this.querySelector( 'tp-form-errors-heading' ) as TPFormErrorsHeadingElement | null;
		const list = this.querySelector( 'tp-form-errors-list' ) as TPFormErrorsListElement | null;

		// Update them.
		heading?.update( 0 );
		list?.clear();
	}
}
