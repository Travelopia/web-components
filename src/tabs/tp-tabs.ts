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
}
