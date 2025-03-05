/**
 * TP Tooltip.
 */
export class TPTooltip extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Call parent's constructor.
		super();

		// Make the tooltip a popover.
		this.makePopover();
	}

	/**
	 * Make this tooltip a popover, if it isn't already.
	 */
	makePopover(): void {
		// Check if this isn't already a popover.
		if ( ! this.getAttribute( 'popover' ) ) {
			this.setAttribute( 'popover', 'popover' );
		}
	}

	/**
	 * Set the content for our tooltip.
	 *
	 * @param {Node|null} content The content of the tooltip.
	 */
	setContent( content: Node|null ): void {
		// Check if we have a valid content node.
		if ( ! content ) {
			// We don't, bail.
			return;
		}

		// Replace slot's children with new content.
		this.querySelector( 'slot' )?.replaceChildren( content );
	}

	/**
	 * Set the position of the tooltip.
	 */
	setPosition(): void {
		// Set the position of this tooltip.
	}

	/**
	 * Show the tooltip.
	 */
	show(): void {
		// Position tooltip and show it.
		this.setPosition();
		this.setAttribute( 'show', 'yes' );
	}

	/**
	 * Hide the tooltip.
	 */
	hide(): void {
		// Hide the attribute.
		this.removeAttribute( 'show' );
	}
}
