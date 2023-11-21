/**
 * Internal dependencies.
 */
import { TPTabsElement } from './tp-tabs';

/**
 * TP Tabs Nav Item Element.
 */
export class TPTabsNavItemElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
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
		const tabs: TPTabsElement | null = this.closest( 'tp-tabs' );
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );
		const anchor: string = link?.getAttribute( 'href' ) ?? '';

		if ( ! tabs || ! link || '' === anchor ) {
			return;
		}

		if ( 'yes' !== tabs.getAttribute( 'update-url' ) ) {
			e.preventDefault();
		}

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
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );
		return `#${ currentTab }` === link?.getAttribute( 'href' );
	}
}
