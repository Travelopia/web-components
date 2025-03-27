/**
 * Internal dependencies.
 */
import { TPTooltipTrigger } from './tp-tooltip-trigger';
import { TPTooltipArrow } from './tp-tooltip-arrow';

/**
 * TP Tooltip.
 */
export class TPTooltip extends HTMLElement {
	/**
	 * Properties.
	 */
	protected trigger: TPTooltipTrigger | null = null;

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
	 * Get offset.
	 */
	get offset(): number {
		// Get the offset.
		return parseInt( this.getAttribute( 'offset' ) ?? '0' );
	}

	/**
	 * Set offset.
	 */
	set offset( offset: number ) {
		// Set or remove offset.
		if ( ! offset ) {
			this.removeAttribute( 'offset' );
		} else {
			this.setAttribute( 'offset', offset.toString() );
		}
	}

	/**
	 * Make this tooltip a popover, if it isn't already.
	 */
	makePopover(): void {
		// Check if this isn't already a popover.
		if ( ! this.getAttribute( 'popover' ) ) {
			this.setAttribute( 'popover', '' );
		}
	}

	/**
	 * Set the trigger.
	 *
	 * @param {HTMLElement} trigger The trigger node.
	 */
	setTrigger( trigger: TPTooltipTrigger ): void {
		// Set the trigger.
		this.trigger = trigger;
	}

	/**
	 * Set the content for our tooltip.
	 */
	setContent(): void {
		// Get content.
		const content: Node | null = this.trigger?.getContent() ?? null;

		// Check if we have content.
		if ( content ) {
			// Yes, replace slot's children with new content.
			this.querySelector( 'slot' )?.replaceChildren( content );
		}
	}

	/**
	 * Set the position of the tooltip.
	 */
	setPosition(): void {
		// Do we have a trigger?
		if ( ! this.trigger ) {
			// We don't, bail!
			return;
		}

		// Get width and height of this tooltip.
		const { height: tooltipHeight, width: tooltipWidth } = this.getBoundingClientRect();

		// Get position and coordinates of the trigger.
		const { x: triggerLeftPosition, y: triggerTopPosition, width: triggerWidth, height: triggerHeight } = this.trigger.getBoundingClientRect();

		// Trigger center from left edge of screen.
		const triggerCenterPosition = triggerLeftPosition + ( triggerWidth / 2 );

		// Get arrow dimensions.
		let arrowHeight: number = 0;
		const arrow: TPTooltipArrow | null = this.querySelector( 'tp-tooltip-arrow' );

		// Check if we have an arrow.
		if ( arrow ) {
			( { height: arrowHeight } = arrow.getBoundingClientRect() );
		}

		// Determine the vertical position of this tooltip.
		if ( triggerTopPosition > tooltipHeight + this.offset + arrowHeight ) {
			// There is enough space on top of trigger element, so place popover above the trigger element.
			this.style.marginTop = `${ triggerTopPosition - tooltipHeight - this.offset - ( arrowHeight / 2 ) }px`;

			// Set arrow placement on bottom of popover
			arrow?.setAttribute( 'position', 'bottom' );
		} else {
			// There is not enough space on top of trigger element, so place popover below the trigger element.
			this.style.marginTop = `${ triggerTopPosition + triggerHeight + this.offset + ( arrowHeight / 2 ) }px`;

			// Set arrow placement on top of popover
			arrow?.setAttribute( 'position', 'top' );
		}

		// Determine the horizontal position of this tooltip.
		if ( triggerCenterPosition < ( tooltipWidth / 2 ) ) {
			// There is not enough space on left of trigger element, so place popover at the left edge of the screen.
			this.style.marginLeft = '0px';
		} else if ( window.innerWidth - triggerCenterPosition < ( tooltipWidth / 2 ) ) {
			// There is not enough space on right of trigger element, so place popover at the right edge of the screen.
			this.style.marginLeft = `${ window.innerWidth - tooltipWidth }px`;
		} else {
			// There is enough space on both sides of trigger element, so place popover at the center of the trigger element.
			this.style.marginLeft = `${ triggerLeftPosition + ( triggerWidth / 2 ) - ( tooltipWidth / 2 ) }px`;
		}

		// Get left position of the tooltip.
		const { left: tooltipLeftPosition } = this.getBoundingClientRect();

		// Percentage the arrow should be moved from left edge of the tooltip.
		const arrowPosition = ( ( triggerCenterPosition - tooltipLeftPosition ) / tooltipWidth ) * 100;

		// Set the arrow position.
		if ( arrow ) {
			arrow.style.left = `${ arrowPosition }%`;
		}
	}

	/**
	 * Show the tooltip.
	 */
	show(): void {
		// Position tooltip and show it.
		this.setContent();

		// Show the tooltip.
		this.showPopover();
		this.setPosition();
		this.setAttribute( 'show', 'yes' );

		// Trigger event.
		this.dispatchEvent( new CustomEvent( 'show' ) );
	}

	/**
	 * Hide the tooltip.
	 */
	hide(): void {
		// Hide the tooltip.
		this.hidePopover();
		this.removeAttribute( 'show' );

		// Trigger event.
		this.dispatchEvent( new CustomEvent( 'hide' ) );
	}
}
