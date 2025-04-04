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
	protected async handleFormSubmit( e: SubmitEvent ): Promise<void> {
		// Stop normal form submission.
		e.preventDefault();
		e.stopImmediatePropagation();

		// Get submit button.
		const submit: TPFormSubmitElement | null = this.querySelector( 'tp-form-submit' );
		submit?.setAttribute( 'submitting', 'yes' );

		// Ignore a form that currently has suspense.
		if ( 'yes' === this.getAttribute( 'suspense' ) ) {
			// Bail early.
			return;
		}

		// Validate the form.
		const formValid: boolean = await this.validate();

		// If form is valid then dispatch a custom 'submit-validation-success' event.
		if ( formValid ) {
			// Trigger event.
			this.dispatchEvent( new CustomEvent( 'submit-validation-success', { bubbles: true } ) );

			// Submit form.
			if ( 'yes' !== this.getAttribute( 'prevent-submit' ) ) {
				this.form?.submit();
			}
		} else {
			// Form is not valid, remove submitting attribute.
			submit?.removeAttribute( 'submitting' );
		}
	}

	/**
	 * Validate the form.
	 *
	 * @return {boolean} Whether the form is valid or not.
	 */
	async validate(): Promise<boolean> {
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

		// Start by setting the form as suspense.
		this.setAttribute( 'suspense', 'yes' );

		// Check if all fields are valid.
		let formValid: boolean = true;
		const validationPromises: Promise<boolean>[] = Array
			.from( fields )
			.map( async ( field: TPFormFieldElement ): Promise<boolean> => await field.validate() );

		// Wait for promises to resolve.
		await Promise.all( validationPromises )
			.then( ( results: boolean[] ): void => {
				// Check if all fields are valid.
				formValid = results.every( ( isValid: boolean ) => isValid );
			} )
			.catch( () => {
				// There was an error with one or more fields.
				formValid = false;
			} )
			.finally( () => this.removeAttribute( 'suspense' ) );

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
	 * Validate one field.
	 *
	 * @param {HTMLElement} field Field node.
	 */
	async validateField( field: TPFormFieldElement ): Promise<boolean> {
		// Set form as suspense, validate and undo suspense.
		this.setAttribute( 'suspense', 'yes' );
		const fieldValid: boolean = await field.validate();
		this.removeAttribute( 'suspense' );

		// Return result.
		return fieldValid;
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
			// Remove 'valid' and 'error' and 'suspense' attributes.
			field.removeAttribute( 'valid' );
			field.removeAttribute( 'error' );
			field.removeAttribute( 'suspense' );
		} );

		// Remove 'suspense' attribute from form.
		this.removeAttribute( 'suspense' );

		// Remove 'submitting' attribute from submit button.
		const submit: TPFormSubmitElement | null = this.querySelector( 'tp-form-submit' );
		submit?.removeAttribute( 'submitting' );
	}
}
