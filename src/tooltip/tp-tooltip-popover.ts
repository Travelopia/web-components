/**
 * Internal dependencies.
 */
import { TPTooltipElement } from './tp-tooltip';
import { TPTooltipArrowElement } from './tp-tooltip-arrow';

/**
 * TP Tooltip Popover.
 */
export class TPTooltipPopoverElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected trigger: TPTooltipElement | null;
	protected arrow: TPTooltipArrowElement | null;
	protected offset: number = 0;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Set attribute for popover.
		this.setAttribute( 'popover', 'true' );

		// Get the internal elements.
		this.trigger = this.closest( 'tp-tooltip' );
		this.arrow = this.querySelector( ':scope > tp-tooltip-arrow' );

		// How far the user wants to display the tooltip from the trigger element.
		this.offset = +( this.trigger?.getAttribute( 'offset' ) || '0' );

		// When tooltip just open, position the tooltip.
		this.addEventListener( 'tooltipjustopen', this.positionTooltip );
	}

	/**
	 * Position tooltip according to the position of the trigger element.
	 */
	positionTooltip() {
		// Early return if trigger button not found.
		if ( ! this.trigger ) {
			// return.
			return;
		}

		// Getting position for tooltip popover.
		const { height: popoverHeight, width: popoverWidth } = this.getElementPosition( this );

		// Getting position for tooltip trigger button.
		const { x: triggerLeftPosition, y: triggerTopPosition, width: triggerWidth, height: triggerHeight } = this.getElementPosition( this.trigger );

		// Getting dimensions for tooltip arrow if present.
		let arrowHeight = 0;
		let arrowWidth = 0;

		// If arrow is present, get the dimensions.
		if ( this.arrow ) {
			( { height: arrowHeight, width: arrowWidth } = this.getElementPosition( this.arrow ) );
		}

		// popover vertical positioning.
		if ( triggerTopPosition > popoverHeight + this.offset + arrowHeight ) {
			// there is enough space on top of trigger element, then place popover above the trigger element.
			this.style.top = `${ triggerTopPosition - popoverHeight - this.offset - ( arrowHeight / 2 ) }px`;

			// Set arrow placement on bottom of popover
			if ( this.arrow ) {
				this.arrow.setAttribute( 'data-placement', 'bottom' );
			}
		} else {
			// there is not enough space on top of trigger element, then place popover below the trigger element
			this.style.top = `${ triggerTopPosition + triggerHeight + this.offset + ( arrowHeight / 2 ) }px`;

			// Set arrow placement on top of popover
			if ( this.arrow ) {
				this.arrow.setAttribute( 'data-placement', 'top' );
			}
		}

		// popover horizontal positioning.
		if ( triggerLeftPosition + ( triggerWidth / 2 ) > ( popoverWidth / 2 ) ) {
			this.style.left = `${ triggerLeftPosition + ( triggerWidth / 2 ) - ( popoverWidth / 2 ) }px`;
		}
	}

	/**
	 * Gets the position of a given element in the viewport.
	 *
	 * @param { Element } element Attribute name.
	 *
	 * @return { DOMRect }        Position of the element.
	 */
	getElementPosition( element : Element ) : DOMRect {
		// Get the DOM rectangle object.
		const elementRect : DOMRect = element?.getBoundingClientRect();

		// Return DOM rectangle object.
		return elementRect;
	}
}
