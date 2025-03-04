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
	protected hasError: boolean;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.hasError = false;

		// Get form.
		this.form = this.querySelector( 'form' );

		// Add event listeners.
		this.form?.addEventListener( 'submit', this.handleFormSubmit.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes observed in the TPFormElement web-component.
		return [ 'has-error', 'pause-submit' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// Dispatch form submit event.
		if ( ( 'has-error' === name || 'pause-submit' === name ) && oldValue !== newValue ) {
			this.handleFormSubmit.bind( this );
		}
	}

	/**
	 * Handle form submission.
	 *
	 * @param {Event} e Submit event.
	 */
	protected handleFormSubmit( e: SubmitEvent ): void {
		// Validate the form.
		const formvalid = this.validate();

		// Dispatch after validate event.
		this.dispatchEvent( new CustomEvent( 'after-validation', { bubbles: true } ) );

		this.hasError = 'yes' === this.getAttribute( 'has-error' ) ? true : false;

		// Prevent form submission if it's invalid.
		if ( ! formvalid || this.hasError || 'yes' === this.getAttribute( 'pause-submit' ) ) {
			e.preventDefault();
			e.stopImmediatePropagation();
		}

		// Get submit button.
		const submit: TPFormSubmitElement | null = this.querySelector( 'tp-form-submit' );

		// If present.
		if ( submit ) {
			// Check if form is valid.
			if ( ! this.hasError ) {
				submit.setAttribute( 'submitting', 'yes' );
			} else {
				submit.removeAttribute( 'submitting' );
			}
		}

		// If form is valid then dispatch a custom 'submit-validation-success' event.
		if ( ! this.hasError ) {
			this.dispatchEvent( new CustomEvent( 'submit-validation-success', { bubbles: true } ) );
		}
	}

	/**
	 * Validate the form.
	 */
	validate(): boolean {
		// Dispatch a custom 'validate' event.
		this.dispatchEvent( new CustomEvent( 'validate', { bubbles: true } ) );

		// Get the form fields.
		const fields: NodeListOf<TPFormFieldElement> | null = this.querySelectorAll( 'tp-form-field' );

		// If no fields are found, return true indicating validation passed.
		if ( ! fields ) {
			this.dispatchEvent( new CustomEvent( 'validation-success', { bubbles: true } ) );

			// Remove has-error attributes, indicating validation passed.
			this.removeAttribute( 'has-error' );
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
			this.removeAttribute( 'has-error' );
			this.dispatchEvent( new CustomEvent( 'validation-success', { bubbles: true } ) );
		} else {
			this.setAttribute( 'has-error', 'yes' );
			this.dispatchEvent( new CustomEvent( 'validation-error', { bubbles: true } ) );
		}

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
