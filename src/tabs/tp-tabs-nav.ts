/**
 * Internal dependencies.
 */
import { TPTabsElement } from './tp-tabs';

/**
 * TP Tabs Nav Element.
 */
export class TPTabsNavElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Add keyboard event listener for arrow key navigation.
		this.addEventListener( 'keydown', this.handleKeyDown.bind( this ) );
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
	 * Get all tab trigger elements (buttons or anchors).
	 *
	 * @return {Array<HTMLButtonElement | HTMLAnchorElement>} Array of trigger elements.
	 */
	private getTabTriggers(): Array<HTMLButtonElement | HTMLAnchorElement> {
		// Get all nav items and collect their triggers.
		const navItems = this.querySelectorAll( 'tp-tabs-nav-item' );
		const triggers: Array<HTMLButtonElement | HTMLAnchorElement> = [];

		// Iterate over nav items to find triggers.
		navItems.forEach( ( navItem ) => {
			// Look for button first, then anchor.
			const trigger = navItem.querySelector( 'button' ) || navItem.querySelector( 'a' );

			// Add trigger to array if found.
			if ( trigger ) {
				triggers.push( trigger );
			}
		} );

		// Return all triggers.
		return triggers;
	}

	/**
	 * Handle keydown events for keyboard navigation.
	 *
	 * @param {KeyboardEvent} e Keyboard event.
	 */
	private handleKeyDown( e: KeyboardEvent ): void {
		// Only handle if aria management is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Bail early.
			return;
		}

		// Get all tab triggers.
		const triggers = this.getTabTriggers();

		// Bail if no triggers.
		if ( triggers.length === 0 ) {
			// Early return.
			return;
		}

		// Find current focused trigger index using ownerDocument.
		const currentIndex = triggers.findIndex( ( trigger ) => trigger === this.ownerDocument.activeElement );

		// Only handle if focus is on a trigger.
		if ( currentIndex === -1 ) {
			// Early return.
			return;
		}

		// Get new index.
		let newIndex = currentIndex;

		// Handle arrow keys, Home, and End.
		switch ( e.key ) {
			// Move to previous tab, wrap to end if at start.
			case 'ArrowLeft':
				newIndex = currentIndex === 0 ? triggers.length - 1 : currentIndex - 1;
				break;

			// Move to next tab, wrap to start if at end.
			case 'ArrowRight':
				newIndex = currentIndex === triggers.length - 1 ? 0 : currentIndex + 1;
				break;

			// Move to first tab.
			case 'Home':
				newIndex = 0;
				break;

			// Move to last tab.
			case 'End':
				newIndex = triggers.length - 1;
				break;

			// Not a navigation key, bail.
			default:

				// Not a navigation key, bail.
				return;
		}

		// Prevent default browser behavior.
		e.preventDefault();

		// Activate the new tab first (updates tabindex), then focus.
		const newTrigger = triggers[ newIndex ];
		newTrigger.click();
		newTrigger.focus();
	}
}
