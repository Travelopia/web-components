/**
 * Internal dependencies.
 */
import { TPFormErrorElement } from './tp-form-error';

/**
 * TP Form Field.
 */
export class TPFormFieldElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get field.
		const field = this.getField();

		// Add event listeners.
		field?.addEventListener( 'keyup', this.handleFieldChanged.bind( this ) );
		field?.addEventListener( 'change', this.handleFieldChanged.bind( this ) );
	}

	/**
	 * Update validation when the field has changed.
	 */
	handleFieldChanged(): void {
		// Validate the field again if 'valid' or 'error' attribute is present.
		if ( this.getAttribute( 'valid' ) || this.getAttribute( 'error' ) ) {
			this.validate();
		}
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes observed in the TPFormFieldElement web-component.
		return [ 'valid', 'error' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// Check if the observed attributes 'valid' or 'error' have changed.

		// Dispatch a custom 'validate' event.
		if ( ( 'valid' === name || 'error' === name ) && oldValue !== newValue ) {
			this.dispatchEvent( new CustomEvent( 'validate', { bubbles: true } ) );
		}

		// Update the component after the attribute change.
		this.update();
	}

	/**
	 * Update component.
	 */
	update(): void {
		// Check if tpFormValidators exist in the window object.
		const { tpFormValidators } = window;

		// Exit the function if validators are not available.
		if ( ! tpFormValidators ) {
			//Early return
			return;
		}

		// Get the 'error' attribute value.
		const error: string = this.getAttribute( 'error' ) ?? '';

		// Check if the error exists and has a corresponding error message function.
		if ( '' !== error && error in tpFormValidators && 'function' === typeof tpFormValidators[ error ].getErrorMessage ) {
			this.setErrorMessage( tpFormValidators[ error ].getErrorMessage( this ) );
		} else {
			this.removeErrorMessage();
		}
	}

	/**
	 * Get the associated field.
	 *
	 * @return {HTMLElement} The associated field for this component.
	 */
	getField(): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
		// Return the associated field by querying input, select, or textarea elements.
		return this.querySelector( 'input,select,textarea' );
	}

	/**
	 * Validate this field.
	 *
	 * @return {boolean} Whether this field passed validation.
	 */
	validate(): boolean {
		// Retrieve tpFormValidators from the window object.
		const { tpFormValidators } = window;

		// Exit the function if validators are not available.
		if ( ! tpFormValidators ) {
			// If no validators are found, return true indicating validation passed.
			return true;
		}

		// Check if the field is visible.
		if ( this.offsetWidth <= 0 || this.offsetHeight <= 0 ) {
			// If the field is not visible, return true indicating validation passed.
			return true;
		}

		// Prepare error and valid status.
		let valid: boolean = true;
		let error: string = '';
		const allAttributes: string[] = this.getAttributeNames();

		// Traverse all attributes to see if we find a matching validator.
		allAttributes.every( ( attributeName: string ): boolean => {
			// Check if the attribute is a validator.
			if ( attributeName in tpFormValidators && 'function' === typeof tpFormValidators[ attributeName ].validate ) {
				// We found one, lets validate the field.
				const isValid: boolean = tpFormValidators[ attributeName ].validate( this );

				// Looks like we found an error!
				if ( false === isValid ) {
					valid = false;
					error = attributeName;

					// return false;
					return false;
				}
			}

			// No error found, all good.
			return true;
		} );

		// Check if the field is valid or not.
		if ( valid ) {
			this.setAttribute( 'valid', 'yes' );
			this.removeAttribute( 'error' );
		} else {
			this.removeAttribute( 'valid' );
			this.setAttribute( 'error', error );
		}

		// Return validity.
		return valid;
	}

	/**
	 * Set the error message.
	 *
	 * @param {string} message Error message.
	 */
	setErrorMessage( message: string = '' ): void {
		// Look for an existing tp-form-error element.
		const error: TPFormErrorElement | null = this.querySelector( 'tp-form-error' );

		// If found, update its innerHTML with the error message. Otherwise, create a new tp-form-error element and append it to the component.
		if ( error ) {
			error.innerHTML = message;
		} else {
			const errorElement: TPFormErrorElement = document.createElement( 'tp-form-error' );
			errorElement.innerHTML = message;
			this.appendChild( errorElement );
		}

		// Dispatch a custom 'validation-error' event.
		this.dispatchEvent( new CustomEvent( 'validation-error' ) );
	}

	/**
	 * Remove the error message.
	 */
	removeErrorMessage(): void {
		// Find and remove the tp-form-error element.
		this.querySelector( 'tp-form-error' )?.remove();

		// Dispatch a custom 'validation-success' event.
		this.dispatchEvent( new CustomEvent( 'validation-success' ) );
	}
}
