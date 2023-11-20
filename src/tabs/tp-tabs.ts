/**
 * Internal dependencies.
 */
import { TPTabNavElement } from './tp-tab-nav';
import { TPTabElement } from './tp-tab';

/**
 * TP Slider.
 */
export class TPTabs extends HTMLElement {
	/**
	 * Properties.
	 *
	 * @private
	 */
	private tabLinks: NodeListOf<HTMLAnchorElement>;
	private tabNavs: NodeListOf<TPTabNavElement>;
	private activeTabId: string;
	private tabs: NodeListOf<TPTabElement>;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Elements.
		this.tabNavs = this.querySelectorAll( 'tp-tab-nav' );
		this.tabLinks = this.querySelectorAll( 'tp-tab-nav a' );
		this.tabs = this.querySelectorAll( 'tp-tab' );
		this.activeTabId = '';

		this.initializeTabs();
	}

	/**
	 * Initialize Tabs.
	 *
	 * @return {void} Null.
	 */
	initializeTabs(): void {
		// Check if tab links exists.
		if ( ! this.tabLinks ) {
			// No, bail early.
			return;
		}

		// Handle Events for Tab Links.
		this.tabLinks.forEach( ( tabLink: HTMLAnchorElement ) => {
			// Handle the click event.
			tabLink.addEventListener( 'click', ( event ) => {
				// Trigger the event.
				this.handleTabLinkClick( event );
			} );

			// Handle the touchend event.
			tabLink.addEventListener( 'touchend', ( event ) => {
				// Trigger the event.
				if ( event.cancelable ) {
					this.handleTabLinkClick( event );
				}
			} );
		} );
	}

	/**
	 * Event: Link clicked.
	 *
	 * @param {Event} event Event.
	 *
	 * @return {void} Null.
	 */
	handleTabLinkClick( event: Event ): void {
		/**
		 * Prevent Default is added remove browser horizontal scroll on mobile
		 * and allow our custom animated scroll.
		 */
		event.preventDefault();
		const clickedTabLink = event.target as HTMLAnchorElement;

		// Checked for tab link clicked.
		if ( ! clickedTabLink ) {
			// No, bail early.
			return;
		}

		// Events.
		this.triggerTabSelection( clickedTabLink );

		// Add hash to the url, which is not added by default because of adding `event.preventDefault()'. @TODO handle URL's without trailing slash.
		window.location.hash = `${ this.activeTabId }`;
	}

	/**
	 * Trigger Tab Selection.
	 *
	 * @param {HTMLElement} clickedTabLink
	 *
	 * @return {void} Null.
	 */
	triggerTabSelection( clickedTabLink: HTMLAnchorElement ): void {
		// Check if clicked tab link exist.
		if ( ! clickedTabLink ) {
			// No, bail early.
			return;
		}

		// Get the values.
		this.activeTabId = clickedTabLink.getAttribute( 'href' ) || '';
		console.log( 'this.activeTabId', this.activeTabId );

		// Events.
		this.toggleTabLinkAttributes( clickedTabLink );
		this.toggleTabContentVisibility();
	}

	/**
	 * Toggle Tab Link Attributes.
	 *
	 * @param {Object} clickedTabLink
	 * @return {void} Null.
	 */
	toggleTabLinkAttributes( clickedTabLink: HTMLAnchorElement ): void {
		// Check if the tab navs exist or clicked.
		if ( ! this.tabNavs || ! clickedTabLink ) {
			// No, bail early.
			return;
		}
		console.log( 'this.tabNavs', this.tabNavs );

		// 1. First remove active attribute from all tab links.
		this.tabNavs.forEach( ( tabNav: TPTabNavElement ) => {
			// Remove the active attribute.
			tabNav.removeAttribute( 'active' );
		} );

		// 2. Then set the 'active' attribute to the clicked tab link's parent.
		if ( clickedTabLink.parentElement ) {
			console.log( 'clickedTabLink', clickedTabLink.parentElement );
			clickedTabLink.parentElement.setAttribute( 'active', 'true' );
		}
	}

	/**
	 * Toggle Tab Content Visibility.
	 *
	 * Toggle the 'active' attributes, so that only
	 * the clicked tab gets visible.
	 *
	 * @return {void} Null.
	 */
	toggleTabContentVisibility(): void {
		// Check if the tab content is exist.
		if ( ! this.tabs ) {
			// No, bail early.
			return;
		}

		// Set tab ID.
		let tabId:string|null = '';

		// Handle the tab content items.
		this.tabs.forEach( ( tab: TPTabElement ) => {
			// Get the tab ID.
			tabId = tab.getAttribute( 'id' );

			/**
			 * If the tabId of the content is same as the clicked tab-link id,
			 * remove 'active' attribute to make the respective content visible.
			 */
			if ( this.activeTabId === tabId ) {
				tab.setAttribute( 'active', 'true' );
			} else {
				tab.removeAttribute( 'active' );
			}
		} );
	}
}
