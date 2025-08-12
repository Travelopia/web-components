/**
 * Internal dependencies.
 */
import { TPPhoneInputCountriesElement } from './tp-phone-input-countries';
import { TpPhoneInputSelectedFlagElement } from './tp-phone-input-selected-flag';

/**
 * TP Phone Input.
 */
export class TPPhoneInputElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected hiddenInput: HTMLInputElement | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Initialize component.
		this.update();
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observed attributes.
		return [ 'name', 'open', 'country-code' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( oldValue: string = '', newValue: string = '' ): void {
		// If no changes.
		if ( oldValue === newValue ) {
			// Exit.
			return;
		}

		// Update display when attributes change.
		this.update();
	}

	/**
	 * Update.
	 */
	protected update(): void {
		// First, let's create the hidden input.
		if ( ! this.hiddenInput ) {
			this.hiddenInput = document.createElement( 'input' );
			this.hiddenInput.setAttribute( 'type', 'hidden' );
			this.appendChild( this.hiddenInput );
		}

		// Update input.
		this.hiddenInput.setAttribute( 'name', this.getAttribute( 'name' ) ?? '' );
		this.hiddenInput.value = '';

		// Get elements.
		const countries: TPPhoneInputCountriesElement | null = this.querySelector( 'tp-phone-input-countries' );
		const selectedFlag: TpPhoneInputSelectedFlagElement | null = this.querySelector( 'tp-phone-input-selected-flag' );

		// Toggle attribute.
		if ( countries ) {
			// Update its attribute.
			if ( 'yes' === this.getAttribute( 'open' ) ) {
				countries.setAttribute( 'open', 'yes' );
			} else {
				countries.removeAttribute( 'open' );
			}
		}

		// Update flag.
		selectedFlag?.setAttribute( 'flag', this.getAttribute( 'country-code' ) ?? '' );
	}
}
