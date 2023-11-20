/**
 * Internal dependencies.
 */
import { TPTabsElement } from './tp-tabs';

/**
 * TP Tabs Nav Item Element.
 */
export class TPTabsNavItemElement extends HTMLElement {
	connectedCallback(): void {
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );
		link?.addEventListener( 'click', this.setTab.bind( this ) );
	}

	setTab(): void {
		const tabs: TPTabsElement | null = this.closest( 'tp-tabs' );
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );
		const anchor: string = link?.getAttribute( 'href' ) ?? '';

		if ( ! tabs || ! link || '' === anchor ) {
			return;
		}

		tabs.setAttribute( 'current-tab', anchor.replace( '#', '' ) );
	}

	isCurrentTab( currentTab: string = '' ): boolean {
		const link: HTMLAnchorElement | null = this.querySelector( 'a' );
		return `#${ currentTab }` === link?.getAttribute( 'href' );
	}
}
