import { TPFormErrorElement } from './tp-form-error';

/**
 * TP Form Field.
 */
export class TPFormFieldElement extends HTMLElement {
	connectedCallback(): void {
		const field = this.getField();
		field?.addEventListener( 'keyup', this.handleFieldChanged.bind( this ) );
		field?.addEventListener( 'change', this.handleFieldChanged.bind( this ) );
	}

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

	update(): void {
		const { tpFormErrors } = window;
		if ( ! tpFormErrors ) {
			return;
		}

		const error: string = this.getAttribute( 'error' ) ?? '';
		if ( '' !== error && error in tpFormErrors && 'string' === typeof tpFormErrors[ error ] ) {
			this.setErrorMessage( tpFormErrors[ error ] );
		} else {
			this.removeErrorMessage();
		}
	}

	getField(): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
		return this.querySelector( 'input,select,textarea' );
	}

	validate(): boolean {
		const { tpFormValidators } = window;
		if ( ! tpFormValidators ) {
			return true;
		}

		let valid: boolean = true;
		let error: string = '';
		const allAttributes: string[] = this.getAttributeNames();

		allAttributes.every( ( attributeName: string ): boolean => {
			if ( attributeName in tpFormValidators && 'function' === typeof tpFormValidators[ attributeName ] ) {
				const isValid: boolean = tpFormValidators[ attributeName ]( this );

				if ( false === isValid ) {
					valid = false;
					error = attributeName;
					return false;
				}
			}

			return true;
		} );

		if ( valid ) {
			this.setAttribute( 'valid', 'yes' );
			this.removeAttribute( 'error' );
		} else {
			this.removeAttribute( 'valid' );
			this.setAttribute( 'error', error );
		}

		return valid;
	}

	setErrorMessage( message: string = '' ): void {
		let error: TPFormErrorElement | null = this.querySelector( 'tp-form-error' );
		if ( error ) {
			error.innerHTML = message;
		} else {
			const errorElement: TPFormErrorElement = document.createElement( 'tp-form-error' );
			errorElement.innerHTML = message;
			this.appendChild( errorElement );
		}
	}

	removeErrorMessage(): void {
		this.querySelector( 'tp-form-error' )?.remove();
	}
}
