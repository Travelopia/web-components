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

		// Events.
		this.addEventListener( 'mouseenter', this.showTooltip.bind( this ) );
		this.addEventListener( 'mouseleave', this.hideTooltip.bind( this ) );
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
}
