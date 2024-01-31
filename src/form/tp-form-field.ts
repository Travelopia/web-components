/**
 * Internal dependencies.
 */
import { TPFormErrorElement } from './tp-form-error';

/**
 * TP Form Field.
 */
export class TPFormFieldElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		const field = this.getField();
		field?.addEventListener( 'keyup', this.handleFieldChanged.bind( this ) );
		field?.addEventListener( 'change', this.handleFieldChanged.bind( this ) );
	}

	/**
	 * Update validation when the field has changed.
	 */
	handleFieldChanged(): void {
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
		if ( ( 'valid' === name || 'error' === name ) && oldValue !== newValue ) {
			this.dispatchEvent( new CustomEvent( 'validate', { bubbles: true } ) );
		}
		this.update();
	}

	/**
	 * Update component.
	 */
	update(): void {
		const { tpFormValidators } = window;
		if ( ! tpFormValidators ) {
			return;
		}

		const error: string = this.getAttribute( 'error' ) ?? '';
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
		return this.querySelector( 'input,select,textarea' );
	}

	/**
	 * Validate this field.
	 *
	 * @return {boolean} Whether this field passed validation.
	 */
	validate(): boolean {
		// Look for validators.
		const { tpFormValidators } = window;
		if ( ! tpFormValidators ) {
			return true;
		}

		// Check if the field is not visible.
		if ( this.offsetWidth <= 0 || this.offsetHeight <= 0 ) {
			return true;
		}

		// Prepare error and valid status.
		let valid: boolean = true;
		let error: string = '';
		const allAttributes: string[] = this.getAttributeNames();

		// Traverse all attributes to see if we find a matching validator.
		allAttributes.every( ( attributeName: string ): boolean => {
			if ( attributeName in tpFormValidators && 'function' === typeof tpFormValidators[ attributeName ].validate ) {
				// We found one, lets validate the field.
				const isValid: boolean = tpFormValidators[ attributeName ].validate( this );

				// Looks like we found an error!
				if ( false === isValid ) {
					valid = false;
					error = attributeName;
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
		const error: TPFormErrorElement | null = this.querySelector( 'tp-form-error' );
		if ( error ) {
			error.innerHTML = message;
		} else {
			const errorElement: TPFormErrorElement = document.createElement( 'tp-form-error' );
			errorElement.innerHTML = message;
			this.appendChild( errorElement );
		}

		this.dispatchEvent( new CustomEvent( 'validation-error' ) );
	}

	/**
	 * Remove the error message.
	 */
	removeErrorMessage(): void {
		this.querySelector( 'tp-form-error' )?.remove();
		this.dispatchEvent( new CustomEvent( 'validation-success' ) );
	}
}
