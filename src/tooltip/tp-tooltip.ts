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
	 * Make this tooltip a popover, if it isn't already.
	 */
	makePopover(): void {
		// Check if this isn't already a popover.
		if ( ! this.getAttribute( 'popover' ) ) {
			this.setAttribute( 'popover', 'popover' );
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

		// Get arrow dimensions.
		let arrowHeight: number = 0;
		const arrow: TPTooltipArrow | null = this.querySelector( 'tp-tooltop-arrow' );

		// Check if we have an arrow.
		if ( arrow ) {
			( { height: arrowHeight } = arrow.getBoundingClientRect() );
		}

		// Determine the vertical position of this tooltip.
		if ( triggerTopPosition > tooltipHeight + this.trigger.offset + arrowHeight ) {
			// There is enough space on top of trigger element, so place popover above the trigger element.
			this.style.top = `${ triggerTopPosition - tooltipHeight - this.trigger.offset - ( arrowHeight / 2 ) }px`;

			// Set arrow placement on bottom of popover
			arrow?.setAttribute( 'position', 'bottom' );
		} else {
			// There is not enough space on top of trigger element, so place popover below the trigger element.
			this.style.top = `${ triggerTopPosition + triggerHeight + this.trigger.offset + ( arrowHeight / 2 ) }px`;

			// Set arrow placement on top of popover
			arrow?.setAttribute( 'position', 'top' );
		}

		// Determine the horizontal position of this tooltip.
		if ( triggerLeftPosition + ( triggerWidth / 2 ) > ( tooltipWidth / 2 ) ) {
			this.style.left = `${ triggerLeftPosition + ( triggerWidth / 2 ) - ( tooltipWidth / 2 ) }px`;
		}
	}

	/**
	 * Show the tooltip.
	 */
	show(): void {
		// Position tooltip and show it.
		this.setContent();
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
