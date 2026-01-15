/**
 * Internal dependencies.
 */
import { TPTabsElement } from './tp-tabs';

/**
 * TP Tabs Nav Item Element.
 */
export class TPTabsNavItemElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Constructor function.
		super();

		// Get the trigger element (button or anchor).
		const trigger = this.getTrigger();

		// Add click event listener to the trigger.
		trigger?.addEventListener( 'click', this.handleTriggerClick.bind( this ) );

		// Set up ARIA attributes.
		this.setupAriaAttributes();
	}

	/**
	 * Get the trigger element (button or anchor).
	 *
	 * @return {HTMLButtonElement | HTMLAnchorElement | null} The trigger element.
	 */
	getTrigger(): HTMLButtonElement | HTMLAnchorElement | null {
		// Look for button first, then anchor.
		return this.querySelector( 'button' ) || this.querySelector( 'a' );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observe the active attribute to update ARIA state.
		return [ 'active' ];
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

		// Update ARIA state when active attribute changes.
		if ( 'active' === name ) {
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
	 * Set up ARIA attributes on the trigger element.
	 */
	private setupAriaAttributes(): void {
		// Check if aria management is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get the trigger element.
		const trigger = this.getTrigger();

		// Bail if no trigger.
		if ( ! trigger ) {
			// Early return.
			return;
		}

		// Generate ID for the trigger if not present.
		if ( ! trigger.id ) {
			trigger.id = `tp-tab-${ Math.random().toString( 36 ).substring( 2, 9 ) }`;
		}

		// Get the panel ID from href (anchor) or aria-controls (button).
		const panelId = this.getPanelId();

		// Set aria-controls if we have a panel ID and it's not already set.
		if ( panelId && ! trigger.hasAttribute( 'aria-controls' ) ) {
			trigger.setAttribute( 'aria-controls', panelId );
		}

		// Set initial ARIA state.
		const isActive = 'yes' === this.getAttribute( 'active' );
		this.updateAriaState( isActive );
	}

	/**
	 * Get the panel ID that this nav item controls.
	 *
	 * @return {string} The panel ID.
	 */
	getPanelId(): string {
		const trigger = this.getTrigger();

		// Bail if no trigger.
		if ( ! trigger ) {
			return '';
		}

		// For anchors, get from href. For buttons, get from aria-controls or data-controls.
		if ( trigger instanceof HTMLAnchorElement ) {
			return trigger.getAttribute( 'href' )?.replace( '#', '' ) ?? '';
		}

		// For buttons, check aria-controls or data-controls.
		return trigger.getAttribute( 'aria-controls' ) || trigger.getAttribute( 'data-controls' ) || '';
	}

	/**
	 * Update ARIA state on the trigger element.
	 *
	 * @param {boolean} isActive Whether this tab is active.
	 */
	private updateAriaState( isActive: boolean ): void {
		// Check if aria management is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get the trigger element.
		const trigger = this.getTrigger();

		// Bail if no trigger.
		if ( ! trigger ) {
			// Early return.
			return;
		}

		// Update aria-selected.
		trigger.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );

		// Update tabindex for roving tabindex pattern.
		trigger.setAttribute( 'tabindex', isActive ? '0' : '-1' );
	}

	/**
	 * Handle trigger click.
	 *
	 * @param {Event} e Click event.
	 *
	 * @protected
	 */
	protected handleTriggerClick( e: Event ): void {
		// Find the closest tp-tabs element.
		const tabs: TPTabsElement | null = this.closest( 'tp-tabs' );
		const trigger = this.getTrigger();
		const panelId = this.getPanelId();

		// If the tabs component, trigger, or panel ID is missing, do nothing.
		if ( ! tabs || ! trigger || '' === panelId ) {
			// Exit if required elements are not found.
			return;
		}

		// For anchors, prevent default if update-url is not enabled.
		if ( trigger instanceof HTMLAnchorElement && 'yes' !== tabs.getAttribute( 'update-url' ) ) {
			e.preventDefault();
		}

		// Update the 'current-tab' attribute on the tabs component.
		tabs.setAttribute( 'current-tab', panelId );
	}

	/**
	 * Check if this component contains the trigger for the current tab.
	 *
	 * @param {string} currentTab Current tab ID.
	 *
	 * @return {boolean} Whether it is the current tab or not.
	 */
	isCurrentTab( currentTab: string = '' ): boolean {
		// Return true if this nav item's panel ID matches the current tab.
		return currentTab === this.getPanelId();
	}
}
