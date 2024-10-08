/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from './tp-form-field';
import { TPFormSubmitElement } from './tp-form-submit';

/**
 * TP Form.
 */
export class TPFormElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected readonly form: HTMLFormElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get form.
		this.form = this.querySelector( 'form' );

		// Add event listeners.
		this.form?.addEventListener( 'submit', this.handleFormSubmit.bind( this ) );
	}

	/**
	 * Handle form submission.
	 *
	 * @param {Event} e Submit event.
	 */
	protected handleFormSubmit( e: SubmitEvent ): void {
		// Validate the form.
		const formValid: boolean = this.validate();

		// Prevent form submission if it's invalid.
		if ( ! formValid || 'yes' === this.getAttribute( 'prevent-submit' ) ) {
			e.preventDefault();
			e.stopImmediatePropagation();
		}

		// Get submit button.
		const submit: TPFormSubmitElement | null = this.querySelector( 'tp-form-submit' );

		// If present.
		if ( submit ) {
			// Check if form is valid.
			if ( formValid ) {
				submit.setAttribute( 'submitting', 'yes' );
			} else {
				submit.removeAttribute( 'submitting' );
			}
		}

		// If form is valid then dispatch a custom 'submit-validation-success' event.
		if ( formValid ) {
			this.dispatchEvent( new CustomEvent( 'submit-validation-success', { bubbles: true } ) );
		}
	}

	/**
	 * Validate the form.
	 *
	 * @return {boolean} Whether the form is valid or not.
	 */
	validate(): boolean {
		// Dispatch a custom 'validate' event.
		this.dispatchEvent( new CustomEvent( 'validate', { bubbles: true } ) );

		// Get the form fields.
		const fields: NodeListOf<TPFormFieldElement> | null = this.querySelectorAll( 'tp-form-field' );

		// If no fields are found, return true indicating validation passed.
		if ( ! fields ) {
			this.dispatchEvent( new CustomEvent( 'validation-success', { bubbles: true } ) );

			// Return true indicating validation passed.
			return true;
		}

		// Check if all fields are valid.
		let formValid: boolean = true;
		fields.forEach( ( field: TPFormFieldElement ): void => {
			// Validate the field.
			if ( ! field.validate() ) {
				formValid = false;
			}
		} );

		// If form is valid then dispatch a custom 'validation-success' event else send a custom 'validation-error' event.
		if ( formValid ) {
			this.dispatchEvent( new CustomEvent( 'validation-success', { bubbles: true } ) );
		} else {
			this.dispatchEvent( new CustomEvent( 'validation-error', { bubbles: true } ) );
		}

		// Return whether the form is valid or not.
		return formValid;
	}

	/**
	 * Reset form validation.
	 */
	resetValidation(): void {
		// Get the form fields.
		const fields: NodeListOf<TPFormFieldElement> | null = this.querySelectorAll( 'tp-form-field' );

		// If no fields are found.
		if ( ! fields ) {
			// Exit the function.
			return;
		}

		// Remove 'valid' and 'error' attributes from all fields.
		fields.forEach( ( field: TPFormFieldElement ): void => {
			// Remove 'valid' and 'error' attribute.
			field.removeAttribute( 'valid' );
			field.removeAttribute( 'error' );
		} );

		// Get submit button.
		const submit: TPFormSubmitElement | null = this.querySelector( 'tp-form-submit' );

		// Remove 'submitting' attribute from submit button.
		submit?.removeAttribute( 'submitting' );
	}
}
