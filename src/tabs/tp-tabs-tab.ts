/**
 * Internal dependencies.
 */
import { TPTabsElement } from './tp-tabs';

/**
 * TP Tabs Tab Element.
 */
export class TPTabsTabElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Set up ARIA attributes.
		this.setupAriaAttributes();
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observe the open attribute to update ARIA state.
		return [ 'open' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string, oldValue: string, newValue: string ): void {
		// Early return if no change.
		if ( oldValue === newValue ) {
			// No change.
			return;
		}

		// Update ARIA state when open attribute changes.
		if ( 'open' === name ) {
			this.updateAriaState( 'yes' === newValue );
		}
	}

	/**
	 * Check if ARIA management is enabled.
	 *
	 * @return {boolean} Whether ARIA management is enabled.
	 */
	private isAriaEnabled(): boolean {
		// Get parent tabs component.
		const tabs: TPTabsElement | null = this.closest( 'tp-tabs' );

		// Return whether aria management is enabled.
		return tabs?.isAriaEnabled() ?? true;
	}

	/**
	 * Set up ARIA attributes on this tab panel.
	 */
	private setupAriaAttributes(): void {
		// Check if aria management is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get the panel ID.
		const panelId = this.getAttribute( 'id' );

		// Find the corresponding tab trigger by matching href.
		if ( panelId ) {
			const tabs: TPTabsElement | null = this.closest( 'tp-tabs' );
			const trigger = tabs?.querySelector( `a[href="#${ panelId }"]` );

			// Set aria-labelledby if trigger has an ID.
			if ( trigger?.id && ! this.hasAttribute( 'aria-labelledby' ) ) {
				this.setAttribute( 'aria-labelledby', trigger.id );
			}
		}

		// Set initial ARIA state.
		const isOpen = 'yes' === this.getAttribute( 'open' );
		this.updateAriaState( isOpen );
	}

	/**
	 * Update ARIA state on this tab panel.
	 *
	 * @param {boolean} isOpen Whether this panel is open.
	 */
	private updateAriaState( isOpen: boolean ): void {
		// Check if aria management is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Update aria-hidden and inert based on open state.
		if ( isOpen ) {
			this.removeAttribute( 'aria-hidden' );
			this.removeAttribute( 'inert' );
		} else {
			this.setAttribute( 'aria-hidden', 'true' );
			this.setAttribute( 'inert', '' );
		}
	}
}
