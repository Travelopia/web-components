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
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.updateTabFromUrlHash();
		window.addEventListener( 'hashchange', this.updateTabFromUrlHash.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'current-tab', 'update-url', 'overflow' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( oldValue === newValue ) {
			return;
		}

		this.update();

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
			return;
		}

		// Update nav items.
		const navItems: NodeListOf<TPTabsNavItemElement> = this.querySelectorAll( 'tp-tabs-nav-item' );
		if ( navItems ) {
			navItems.forEach( ( navItem: TPTabsNavItemElement ): void => {
				if ( navItem.isCurrentTab( currentTab ) ) {
					navItem.setAttribute( 'active', 'yes' );
				} else {
					navItem.removeAttribute( 'active' );
				}
			} );
		}

		// Update tabs.
		const tabs: NodeListOf<TPTabsTabElement> = this.querySelectorAll( 'tp-tabs-tab' );
		if ( tabs ) {
			tabs.forEach( ( tab: TPTabsTabElement ): void => {
				if ( currentTab === tab.getAttribute( 'id' ) ) {
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
		if ( 'yes' !== this.getAttribute( 'update-url' ) ) {
			return;
		}

		const urlHash: string = window.location.hash;
		if ( '' !== urlHash ) {
			this.setAttribute( 'current-tab', urlHash.replace( '#', '' ) );
		}
	}

	/**
	 * Set current tab.
	 *
	 * @param {string} tabId Tab ID.
	 */
	setCurrentTab( tabId: string = '' ): void {
		this.setAttribute( 'current-tab', tabId );
	}
}
