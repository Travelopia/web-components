import { TPTooltipPopoverElement } from "./tp-tooltip-popover";
import { TPTooltipTriggerElement } from "./tp-tooltip-trigger";

/**
 * TP Tooltip Popover.
 */
export class TPTooltipElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected uniqueId: string = crypto.randomUUID();
	protected target: TPTooltipPopoverElement | null;
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.target = this.querySelector( ':scope > tp-tooltip-popover' );

		this.appendTriggerButton();
		this.setPopoverTarget();
	}

	/**
	 * Append a button to the trigger element. This button will be the actual target of mouse events.
	 * Because popover API only work with Button element as a trigger point.
	 * We move the slotted content into the button and add listeners to show/hide the tooltip.
	 * If no trigger element is found, log an error and do nothing.
	 */

	appendTriggerButton() {
		const trigger: TPTooltipTriggerElement | null = this.querySelector( 'tp-tooltip-trigger' );

		if ( ! trigger ) {
			console.error( 'tp-tooltip-trigger not found' );
			return;
		}
		// Move slotted content into the button
		const button = document.createElement( 'button' );
		if ( trigger?.firstElementChild ) {
			button?.appendChild(trigger.firstElementChild);
		}

		button.setAttribute( 'popovertarget', this.uniqueId );

		button.addEventListener( 'mouseenter', () => {
			this.target?.showTooltip();
		});
		button.addEventListener( 'mouseleave', () => {
			this.target?.hideTooltip();
		});

		trigger?.appendChild( button );
	}

	/**
	 * Set the popover target and unique id of the tp-tooltip-popover element.
	 * The popover target is set to "auto" and the id is set to the uniqueId property.
	 * If no target element is found, log an error and do nothing.
	 */
	setPopoverTarget() {
		if( ! this.target ) {
			console.error( 'tp-tooltip-popover not found' );
			return;
		}
		this.target.setAttribute( 'popover', "auto" );
		this.target.setAttribute( 'id', this.uniqueId );
	}
}