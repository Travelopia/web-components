// import { TPTooltipTriggerElement } from "./tp-tooltip-trigger";

import { TPTooltipTriggerElement } from "./tp-tooltip-trigger";

/**
 * TP Tooltip Popover.
 */
export class TPTooltipElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected uniqueId: string = crypto.randomUUID();

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		console.log("tooltip");
		this.appendTriggerButton();
		this.setPopoverTarget();
	}
	appendTriggerButton() {
		const trigger: TPTooltipTriggerElement | null = this.querySelector( 'tp-tooltip-trigger' );
		// Move slotted content into the button
		const button = document.createElement( 'button' );
		console.log(trigger?.firstElementChild);
		if ( trigger?.firstElementChild ) {
			button?.appendChild(trigger.firstElementChild);
		}

		button.setAttribute( 'popovertarget', this.uniqueId );

		trigger?.appendChild( button );
	}

	setPopoverTarget() {
		const target = this.querySelector( 'tp-tooltip-popover' );
		target?.setAttribute( 'popover', "auto" );
		target?.setAttribute( 'id', this.uniqueId );
	}
}