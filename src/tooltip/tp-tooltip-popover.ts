import { TPTooltipElement } from "./tp-tooltip";

/**
 * TP Tooltip Popover.
 */
export class TPTooltipPopoverElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected trigger: TPTooltipElement | null;
	protected tooltipWidth: number;
	protected tooltipArrowHeight: number;
	protected tooltipGap: number;

	constructor() {

		// Initialize parent.
		super();

		this.trigger = this.closest( 'tp-tooltip' );
		this.tooltipWidth = parseInt(this.style.width) || 0;
		this.tooltipArrowHeight = parseInt(this.getAttribute( 'arrow-height' ) || '8');
		this.tooltipGap = parseInt(this.getAttribute( 'gap' ) || '10');
	}

	showTooltip() {
		this.showPopover();
		this.positionTooltip();
	}

	hideTooltip() {
		this.hidePopover();
	}

	/**
	 * Position tooltip according to the position of the trigger element.
	 * Position is calculated based on the following rules:
	 * 1. If there is enough space above  the trigger element, tooltip will be placed below the trigger element else it will be above.
	 * 2. If there is enough space to the right of the trigger element tooltip will be aligned with the parent container of tp-tooltip element
	 *    the tooltip will be placed to the left of the trigger element.
	 * 3. Similarly if there is not enough space on right of the trigger element.
	 */
	positionTooltip() {
		// Early return if button not found.
		if( !this.trigger ) {
			return;
		}

		// Getting positions of elements of interest.
		// Getting position for tooltip popover.
		const tooltipPopoverPosition = this.getElementPosition( this );
		console.log(tooltipPopoverPosition);

		// Getting position for tooltip trigger button.
		const tooltipTriggerPosition = this.getElementPosition( this.trigger );

		// Getting position for tooltip parent element.
		// It will be used to position tooltip when there is not enough space to the right and left.
		const parentPosition = this.getElementPosition( this.trigger.parentNode as Element );

		if( tooltipPopoverPosition && tooltipTriggerPosition && parentPosition) {
			const distanceFromTopWall = (tooltipTriggerPosition.bottom - tooltipTriggerPosition.height);

			// Getting viewport width.
			const viewportWidth = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 );

			const tooltipTriggerHalfWidth = tooltipTriggerPosition.width / 2;
			const tooltipPopupHalfWidth = this.tooltipWidth / 2;
			const marginFromWalls = 0;

			// Setting tooltip text and arrow position in Y direction
			let textMarginTop;
			let arrowTopPosition;

			if( tooltipPopoverPosition.height + marginFromWalls > distanceFromTopWall ) {
				textMarginTop = tooltipTriggerPosition.bottom + this.tooltipGap + this.tooltipArrowHeight;
				this.style.setProperty( '--border-bottom-color', "#121212" );
				arrowTopPosition = tooltipTriggerPosition.bottom - this.tooltipArrowHeight + this.tooltipGap;
			} else {
				textMarginTop = tooltipTriggerPosition.bottom - tooltipPopoverPosition.height - tooltipTriggerPosition.height - this.tooltipGap - this.tooltipArrowHeight;
				this.style.setProperty( '--border-top-color', "#121212" );
				arrowTopPosition = tooltipTriggerPosition.bottom - tooltipTriggerPosition.height - this.tooltipGap - this.tooltipArrowHeight;
			}
			console.log(tooltipTriggerPosition.bottom, textMarginTop, arrowTopPosition);
			
			this.style.marginTop = `calc(${ textMarginTop }px )`;
			this.style.setProperty( '--arrow-top-positioning', `${ arrowTopPosition }px` );


			// Position tooltip in X direction.
			let textMarginLeft;
			const arrowLeftPosition = tooltipTriggerPosition.right - tooltipTriggerHalfWidth;

			if ( viewportWidth - tooltipTriggerPosition.right + tooltipTriggerHalfWidth < tooltipPopupHalfWidth + marginFromWalls ) {
				// Position of tooltip if there is not enough space to the right.
				textMarginLeft = parentPosition.right - this.tooltipWidth;
			} else if ( tooltipTriggerPosition.right - tooltipTriggerHalfWidth < tooltipPopupHalfWidth + marginFromWalls ) {
				// Position of tooltip if there is not enough space to the left.
				textMarginLeft = parentPosition.right - parentPosition.width;
			} else {
				textMarginLeft = tooltipTriggerPosition.right - tooltipPopupHalfWidth - tooltipTriggerHalfWidth;
			}

			// Setting location of the tooltip text.
			this.style.marginLeft = textMarginLeft + 'px';
			this.style.setProperty( '--arrow-left-positioning', `${ arrowLeftPosition }px` );
		}
	}

	/**
	 * Gets the position of a given element in the viewport.
	 */
	getElementPosition( element : Element | null ) {
		const elementRect = element?.getBoundingClientRect();
		return elementRect;
	}
}