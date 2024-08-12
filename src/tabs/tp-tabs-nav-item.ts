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

		// Find the anchor element within this component and add a click event listener.
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );
		link?.addEventListener( 'click', this.handleLinkClick.bind( this ) );
	}

	/**
	 * Handle link click.
	 *
	 * @param {Event} e Click event.
	 *
	 * @protected
	 */
	protected handleLinkClick( e: Event ): void {
		// Find the closest tp-tabs element and the anchor element within this component.
		const tabs: TPTabsElement | null = this.closest( 'tp-tabs' );
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );
		const anchor: string = link?.getAttribute( 'href' ) ?? '';

		// If the tabs component, link, or anchor is missing, do nothing.
		if ( ! tabs || ! link || '' === anchor ) {
			// Exit if the tabs component or the link is not found.
			return;
		}

		// If the 'update-url' attribute is not set to 'yes', prevent the default link behavior.
		if ( 'yes' !== tabs.getAttribute( 'update-url' ) ) {
			e.preventDefault();
		}

		// Update the 'current-tab' attribute on the tabs component with the anchor's ID.
		tabs.setAttribute( 'current-tab', anchor.replace( '#', '' ) );
	}

	/**
	 * Check if this component contains the link to the current tab.
	 *
	 * @param {string} currentTab Current tab ID.
	 *
	 * @return {boolean} Whether it is the current tab or not.
	 */
	isCurrentTab( currentTab: string = '' ): boolean {
		// Find the anchor element within this component.
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );

		// Return true if the anchor's href matches the current tab ID.
		return `#${ currentTab }` === link?.getAttribute( 'href' );
	}
}
