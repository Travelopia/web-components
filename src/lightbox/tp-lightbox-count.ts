/**
 * Internal dependencies.
 */
import { TPLightboxElement } from './tp-lightbox';

/**
 * TP Slider Count.
 */
export class TPLightboxCountElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} Observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes to observe.
		return [ 'format' ];
	}

	/**
	 * Get format.
	 *
	 * @return {string} Format.
	 */
	get format(): string {
		// Get format.
		return this.getAttribute( 'format' ) ?? '$current / $total';
	}

	/**
	 * Set format.
	 *
	 * @param {string} format Format.
	 */
	set format( format: string ) {
		// Set the 'format' attribute value.
		this.setAttribute( 'format', format );
	}

	/**
	 * Attribute changed callback.
	 */
	attributeChangedCallback(): void {
		// On change of format attribute, update the component.
		this.update();
	}

	/**
	 * Update component.
	 */
	update(): void {
		// Get lightbox.
		const lightbox: TPLightboxElement | null = this.closest( 'tp-lightbox' );

		// Check if we have a lightbox.
		if ( ! lightbox ) {
			// Exit.
			return;
		}

		// Get current and total.
		const current: string = lightbox.currentIndex.toString();
		const total: string = lightbox.getAttribute( 'total' ) ?? '';

		// Update variables in format attribute.
		this.textContent =
			this.format
				.replace( '$current', current )
				.replace( '$total', total );

		// Update current and total attributes.
		this.setAttribute( 'current', current );
		this.setAttribute( 'total', total );
	}
}
