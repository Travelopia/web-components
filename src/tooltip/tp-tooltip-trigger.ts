/**
 * Internal dependencies.
 */
import { TPTooltip } from './tp-tooltip';

/**
 * TP Tooltip Trigger.
 */
export class TPTooltipTrigger extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Call parent's constructor.
		super();

		// Check if touch device.
		if ( navigator.maxTouchPoints > 0 ) {
			// Yes it is, toggle tooltip on click.
			this.addEventListener( 'click', this.toggleTooltip.bind( this ) );
		} else {
			// Else add event listeners for mouse.
			this.addEventListener( 'mouseenter', this.showTooltip.bind( this ) );
			this.addEventListener( 'mouseleave', this.hideTooltip.bind( this ) );
		}

		// On window scroll, hide tooltip.
		window.addEventListener( 'scroll', this.handleWindowScroll.bind( this ), true );
	}

	/**
	 * Toggle the tooltip.
	 */
	toggleTooltip(): void {
		// Get the tooltip.
		const tooltipId: string = this.getAttribute( 'tooltip' ) ?? '';

		// Check if we have a tooltip.
		if ( '' === tooltipId ) {
			// We don't, bail.
			return;
		}

		// Find the tooltip.
		const tooltip: TPTooltip | null = document.querySelector( `#${ tooltipId }` );

		// Check if the tooltip is already shown.
		if ( 'yes' === tooltip?.getAttribute( 'show' ) ) {
			// It is, hide it.
			tooltip?.hide();
		} else {
			// It isn't, show it.
			tooltip?.setTrigger( this );
			tooltip?.show();
		}
	}

	/**
	 * Show the tooltip.
	 */
	showTooltip(): void {
		// Get the tooltip.
		const tooltipId: string = this.getAttribute( 'tooltip' ) ?? '';

		// Check if we have a tooltip.
		if ( '' === tooltipId ) {
			// We don't, bail.
			return;
		}

		// Find and show the tooltip with its content.
		const tooltip: TPTooltip | null = document.querySelector( `#${ tooltipId }` );
		tooltip?.setTrigger( this );
		tooltip?.show();
	}

	/**
	 * Hide the tooltip.
	 */
	hideTooltip(): void {
		// Get the tooltip.
		const tooltipId: string = this.getAttribute( 'tooltip' ) ?? '';

		// Check if we have a tooltip.
		if ( '' === tooltipId ) {
			// We don't, bail.
			return;
		}

		// Find and hide the tooltip.
		const tooltip: TPTooltip | null = document.querySelector( `#${ tooltipId }` );
		tooltip?.hide();
	}

	/**
	 * Get the content of the tooltip.
	 *
	 * @return {Node|null} The content of the tooltip.
	 */
	getContent(): Node | null {
		// Find template for content.
		const template: HTMLTemplateElement | null = this.querySelector( 'template' );

		// Check if we found a template.
		if ( template ) {
			// We did, return its content.
			return template.content.cloneNode( true );
		}

		// No template found, return null.
		return null;
	}

	/**
	 * Handles the scroll outside of the tooltip.
	 *
	 * @param { Event } evt The event object.
	 */
	handleWindowScroll( evt: Event ) {
		// Get the tooltip.
		const tooltipId: string = this.getAttribute( 'tooltip' ) ?? '';
		const tooltip: TPTooltip | null = document.querySelector( `#${ tooltipId }` );

		// If the content was the original target.
		if ( evt.target === tooltip ) {
			// Do nothing.
			return;
		}

		// Hide the popover
		this.hideTooltip();
	}
}
