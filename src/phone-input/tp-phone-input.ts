/**
 * Internal dependencies.
 */
import { TPPhoneInputPhoneCodeElement } from './tp-phone-input-phone-code';
import { TPPhoneInputCountryElement } from './tp-phone-input-country';

/**
 * TP Phone Input.
 */
export class TPPhoneInputElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected readonly countryButton: HTMLButtonElement | null;
	protected readonly countryList: HTMLElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get elements.
		this.countryButton = this.querySelector( 'tp-phone-input-countries button' );
		this.countryList = this.querySelector( 'tp-phone-input-country-list' );

		// Add event listeners.
		this.countryButton?.addEventListener( 'click', this.toggleDropdown.bind( this ) );
		document.addEventListener( 'click', this.handleDocumentClick.bind( this ) );

		// Initialize component.
		this.initialize();
	}

	/**
	 * Initialize component.
	 */
	protected initialize(): void {
		// Set initial state based on attributes.
		this.updateDisplay();
	}

	/**
	 * Toggle dropdown.
	 *
	 * @param {Event} e Click event.
	 */
	protected toggleDropdown( e: Event ): void {
		// Prevent default behavior and stop propagation.
		e.preventDefault();
		e.stopPropagation();

		// Toggle open state.
		const isOpen = this.getAttribute( 'open' ) === 'yes';
		if ( isOpen ) {
			this.removeAttribute( 'open' );
		} else {
			this.setAttribute( 'open', 'yes' );
		}
	}

	/**
	 * Handle document click.
	 *
	 * @param {Event} e Click event.
	 */
	protected handleDocumentClick( e: Event ): void {
		// Close on click outside.
		if ( this !== e.target && ! this.contains( e.target as Node ) ) {
			this.removeAttribute( 'open' );
		}
	}

	/**
	 * Update display.
	 */
	protected updateDisplay(): void {
		// Update button display.
		if ( this.countryButton ) {
			const country = this.getAttribute( 'country' );
			const phoneCode = this.getAttribute( 'phone-code' );
			if ( country && phoneCode ) {
				// Find the flag for this country.
				const countryElement: TPPhoneInputCountryElement | null = this.querySelector( `tp-phone-input-country[value="${ this.getAttribute( 'value' ) }"]` );
				const flagElement = countryElement?.querySelector( 'tp-phone-input-flag' );
				const flag = flagElement?.textContent || '🏳️';

				this.countryButton.innerHTML = `${ flag } ▼`;

				const phoneCodeElement: TPPhoneInputPhoneCodeElement | null = this.querySelector( 'tp-phone-input-phone-code' );
				phoneCodeElement?.setAttribute( 'value', phoneCode );
			}
		}
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observed attributes.
		return [ 'value', 'country', 'phone-code', 'format' ];
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
		this.updateDisplay();
	}
}
