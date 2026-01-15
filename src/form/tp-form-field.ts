/**
 * Internal dependencies.
 */
import { TPFormElement } from './tp-form';
import { TPFormErrorElement } from './tp-form-error';
import { TPFormSuspenseElement } from './tp-form-suspense';

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

		// Set up accessibility attributes.
		this.setupAccessibility();
	}

	/**
	 * Set up accessibility attributes (label linking, IDs).
	 */
	private setupAccessibility(): void {
		// Get the field.
		const field = this.getField();

		// Bail if no field.
		if ( ! field ) {
			// Early return.
			return;
		}

		// Generate ID for the field if not present.
		if ( ! field.id ) {
			field.id = `tp-field-${ Math.random().toString( 36 ).substring( 2, 9 ) }`;
		}

		// Get label.
		const label = this.querySelector( 'label' );

		// Set for attribute on label if not present.
		if ( label && ! label.hasAttribute( 'for' ) ) {
			label.setAttribute( 'for', field.id );
		}
	}

	/**
	 * Update validation when the field has changed.
	 */
	handleFieldChanged(): void {
		// Check if we want to ignore field revalidations.
		if ( 'no' === this.getAttribute( 'revalidate-on-change' ) ) {
			// Yes we do, bail!
			return;
		}

		// Validate the field again if 'valid' or 'error' attribute is present.
		if ( this.getAttribute( 'valid' ) || this.getAttribute( 'error' ) ) {
			const form: TPFormElement | null = this.closest( 'tp-form' );
			form?.validateField( this );
		}
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes observed in the TPFormFieldElement web-component.
		return [ 'valid', 'error', 'suspense' ];
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
		if ( ( 'valid' === name || 'error' === name || 'suspense' === name ) && oldValue !== newValue ) {
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
			// Early return.
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

		// Get the 'suspense' attribute value.
		const suspense: string = this.getAttribute( 'suspense' ) ?? '';

		// Check if the suspense exists and has a corresponding suspense message function.
		if ( '' !== suspense && suspense in tpFormValidators && 'function' === typeof tpFormValidators[ suspense ].getSuspenseMessage ) {
			// @ts-ignore
			this.setSuspenseMessage( tpFormValidators[ suspense ]?.getSuspenseMessage( this ) );
		} else {
			this.removeSuspenseMessage();
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
	async validate(): Promise<boolean> {
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
		let suspense: Promise<boolean> | null = null;
		let error: string = '';
		const allAttributes: string[] = this.getAttributeNames();

		// Traverse all attributes to see if we find a matching validator.
		allAttributes.every( ( attributeName: string ): boolean => {
			// Check if the attribute is a validator.
			if ( attributeName in tpFormValidators && 'function' === typeof tpFormValidators[ attributeName ].validate ) {
				// We found one, lets validate the field.
				const isValid: boolean | Promise<boolean> = tpFormValidators[ attributeName ].validate( this );
				error = attributeName;

				// First check for a Promise.
				if ( isValid instanceof Promise ) {
					// Yes it is an async validation.
					valid = false;

					// Dispatch a custom 'validation-suspense-start' event.
					this.dispatchEvent( new CustomEvent( 'validation-suspense-start' ) );

					// Create the promise.
					suspense = new Promise( ( resolve, reject ): void => {
						// Validate it.
						isValid
							.then( ( suspenseIsValid: boolean ) => {
								// Validation is complete.
								if ( true === suspenseIsValid ) {
									this.setAttribute( 'valid', 'yes' );
									this.removeAttribute( 'error' );

									// Resolve the promise.
									resolve( true );
								} else {
									this.removeAttribute( 'valid' );
									this.setAttribute( 'error', error );

									// Resolve the promise.
									resolve( false );
								}

								// Dispatch a custom 'validation-suspense-success' event.
								this.dispatchEvent( new CustomEvent( 'validation-suspense-success' ) );
							} )
							.catch( (): void => {
								// There was an error.
								this.removeAttribute( 'valid' );
								this.setAttribute( 'error', error );

								// Dispatch a custom 'validation-suspense-error' event.
								this.dispatchEvent( new CustomEvent( 'validation-suspense-error' ) );

								// Reject the promise.
								reject( false );
							} )
							.finally( (): void => {
								// Clean up.
								this.removeAttribute( 'suspense' );
							} );
					} );

					// Return.
					return false;
				} else if ( false === isValid ) {
					// Not a Promise, but looks like we found an error!
					valid = false;

					// Return.
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
			this.removeAttribute( 'suspense' );
		} else {
			this.removeAttribute( 'valid' );

			// Check for suspense.
			if ( suspense ) {
				this.setAttribute( 'suspense', error );
				this.removeAttribute( 'error' );
			} else {
				this.removeAttribute( 'suspense' );
				this.setAttribute( 'error', error );
			}
		}

		// Do we have a suspense?
		if ( suspense ) {
			// Yes we do, return the promise.
			return suspense;
		}

		// No we don't, return a resolved promise.
		return valid;
	}

	/**
	 * Set the error message.
	 *
	 * @param {string} message Error message.
	 */
	setErrorMessage( message: string = '' ): void {
		// Look for an existing tp-form-error element.
		let error: TPFormErrorElement | null = this.querySelector( 'tp-form-error' );

		// If found, update its textContent with the error message. Otherwise, create a new tp-form-error element and append it to the component.
		if ( error ) {
			error.textContent = message;
		} else {
			error = document.createElement( 'tp-form-error' );
			error.textContent = message;
			error.setAttribute( 'role', 'alert' );
			this.appendChild( error );
		}

		// Set up accessibility for the error message.
		const field = this.getField();

		// Set aria-invalid on the field.
		if ( field ) {
			field.setAttribute( 'aria-invalid', 'true' );

			// Generate ID for error element if not present.
			if ( ! error.id ) {
				error.id = `tp-error-${ Math.random().toString( 36 ).substring( 2, 9 ) }`;
			}

			// Link field to error via aria-describedby.
			field.setAttribute( 'aria-describedby', error.id );
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

		// Remove accessibility attributes from the field.
		const field = this.getField();

		// Remove aria-invalid and aria-describedby.
		if ( field ) {
			field.removeAttribute( 'aria-invalid' );
			field.removeAttribute( 'aria-describedby' );
		}

		// Dispatch a custom 'validation-success' event.
		this.dispatchEvent( new CustomEvent( 'validation-success' ) );
	}

	/**
	 * Set the suspense message.
	 *
	 * @param {string} message Suspense message.
	 */
	setSuspenseMessage( message: string = '' ): void {
		// Look for an existing tp-form-error element.
		const suspense: TPFormSuspenseElement | null = this.querySelector( 'tp-form-suspense' );

		// If found, update its textContent with the suspense message. Otherwise, create a new tp-form-suspense element and append it to the component.
		if ( suspense ) {
			suspense.textContent = message;
		} else {
			const suspenseElement: TPFormSuspenseElement = document.createElement( 'tp-form-suspense' );
			suspenseElement.textContent = message;
			this.appendChild( suspenseElement );
		}
	}

	/**
	 * Remove the suspense message.
	 */
	removeSuspenseMessage(): void {
		// Find and remove the tp-form-suspense element.
		this.querySelector( 'tp-form-suspense' )?.remove();
	}
}
