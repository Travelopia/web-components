/**
 * Internal dependencies.
 */
import { TPTabsNavItemElement } from './tp-tabs-nav-item';
import { TPTabsTabElement } from './tp-tabs-tab';

/**
 * TP Tabs.
 */
export class TPTabsElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Update the current tab based on the URL hash.
		this.updateTabFromUrlHash();

		// Listen for hash changes in the URL and update the tab accordingly.
		window.addEventListener( 'hashchange', this.updateTabFromUrlHash.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes observed in the TPTabsElement web-component.
		return [ 'current-tab', 'update-url', 'overflow', 'aria' ];
	}

	/**
	 * Check if ARIA management is enabled.
	 *
	 * @return {boolean} Whether ARIA management is enabled.
	 */
	isAriaEnabled(): boolean {
		// Return whether aria management is enabled (default: yes).
		return 'no' !== this.getAttribute( 'aria' );
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// If the attribute value hasn't changed, do nothing.
		if ( oldValue === newValue ) {
			// Early return.
			return;
		}

		// Update the component whenever an observed attribute changes.
		this.update();

		// If the 'current-tab' attribute has changed, dispatch a 'change' event.
		if ( 'current-tab' === name ) {
			this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
		}
	}

	/**
	 * Update this component.
	 */
	update(): void {
		// Get current tab.
		const currentTab: string = this.getAttribute( 'current-tab' ) ?? '';

		// Check if current tab exists.
		if ( ! this.querySelector( `tp-tabs-tab[id="${ currentTab }"]` ) ) {
			// Exit if no matching tab is found.
			return;
		}

		// Get current nested tab if has.
		const currentNestedTab = this.getCurrentNestedTab( currentTab );

		// Update nav items.
		const navItems: NodeListOf<TPTabsNavItemElement> = this.querySelectorAll( 'tp-tabs-nav-item' );

		// Update the navigation items based on the current tab.
		if ( navItems ) {
			navItems.forEach( ( navItem: TPTabsNavItemElement ): void => {
				// If the nav item corresponds to the current tab or nested tab, set it as active.
				if ( navItem.isCurrentTab( currentTab ) || ( currentNestedTab && navItem.isCurrentTab( currentNestedTab ) ) ) {
					navItem.setAttribute( 'active', 'yes' );
				} else {
					navItem.removeAttribute( 'active' );
				}
			} );
		}

		// Update tabs.
		const tabs: NodeListOf<TPTabsTabElement> = this.querySelectorAll( 'tp-tabs-tab' );

		// Update the tab panels based on the current tab.
		if ( tabs ) {
			tabs.forEach( ( tab: TPTabsTabElement ): void => {
				// If the tab corresponds to the current tab or nested tab, open it.
				if ( currentTab === tab.getAttribute( 'id' ) || ( currentNestedTab && currentNestedTab === tab.getAttribute( 'id' ) ) ) {
					tab.setAttribute( 'open', 'yes' );
				} else {
					tab.removeAttribute( 'open' );
				}
			} );
		}
	}

	/**
	 * Update tab from URL hash.
	 */
	updateTabFromUrlHash(): void {
		// If 'update-url' attribute is not set to 'yes', do nothing.
		if ( 'yes' !== this.getAttribute( 'update-url' ) ) {
			// Exit if the 'update-url' attribute is not enabled.
			return;
		}

		// Set current associated tab.
		this.setCurrentTab();
	}

	/**
	 * Set current tab.
	 *
	 * @param {string} tabId Tab ID.
	 */
	setCurrentTab( tabId: string = '' ): void {
		// If a tab ID is provided, set it as the current tab.
		if ( '' !== tabId ) {
			this.setAttribute( 'current-tab', tabId );
		}

		// Set current tab based on current url hash.
		const urlHash: string = window.location.hash;

		// Find the link that matches the URL hash.
		if ( '' !== urlHash ) {
			const currentLink: HTMLAnchorElement | null = this.querySelector( `a[href="${ urlHash }"]` );
			const currentTab = currentLink?.closest( 'tp-tabs' );
			currentTab?.setAttribute( 'current-tab', urlHash.replace( '#', '' ) );
		}
	}

	/**
	 * Get current nested tab.
	 *
	 * @param {string} currentTab Tab ID.
	 *
	 * @return {string} If has Nested current tab or empty.
	 */
	getCurrentNestedTab( currentTab: string = '' ): string {
		// If no current tab is provided, return an empty string.
		if ( '' === currentTab ) {
			// Exit if no current tab is provided.
			return '';
		}

		// Find the element corresponding to the current tab ID.
		const currentTabElement = this.querySelector( `tp-tabs-tab[id="${ currentTab }"]` );

		// Find the nested tp-tabs element within the current tab.
		const currentNestedTabElement = currentTabElement?.querySelector( 'tp-tabs' );

		// Get the ID of the current nested tab, if any.
		const currentNestedTab = currentNestedTabElement?.getAttribute( 'current-tab' );

		// Return the nested tab ID, or an empty string if none exists.
		return currentNestedTab ?? '';
	}
}
