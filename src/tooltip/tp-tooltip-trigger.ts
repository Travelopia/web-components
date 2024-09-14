/**
 * TP Tooltip Trigger.
 */
export class TPTooltipTriggerElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected triggerButton: HTMLElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		console.log("trigger");

		this.triggerButton = this.querySelector( ':scope > button' );
		console.log(this.triggerButton);

		if( this.triggerButton ) {
			this.triggerButton.addEventListener( 'mouseenter', this.showTooltip.bind( this ) );
			this.triggerButton.addEventListener( 'mouseleave', this.hideTooltip );
		}
	}

	showTooltip() {
		
		console.log(this.triggerButton);
		if(this.triggerButton){
			this.triggerButton.showPopover();
		}
	}
	hideTooltip() {
		if(this.triggerButton){
			console.log("hide");
			this.triggerButton.hidePopover();
		}
	}
}