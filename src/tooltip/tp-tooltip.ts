/**
 * Internal dependencies.
 */
import { TPTooltipPopoverElement } from './tp-tooltip-popover';

/**
 * TP Tooltip Popover.
 */
export class TPTooltipElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected target: TPTooltipPopoverElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.target = this.querySelector( ':scope > tp-tooltip-popover' );

		// Add event listeners for tooltip invocation.
		this.addEventListener( 'mouseenter', this.openPopover );
		this.addEventListener( 'mouseleave', () => this.target?.hidePopover() );
	}

	/**
	 * Open popover.
	 */
	openPopover() {
		// Show the tooltip.
		this.target?.showPopover();

		// Dispatch event just after tooltip display.
		this.target?.dispatchEvent( new CustomEvent( 'tooltipjustopen' ) );
	}
}
