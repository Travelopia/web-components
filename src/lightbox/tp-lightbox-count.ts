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
		return [ 'format' ];
	}

	/**
	 * Get format.
	 *
	 * @return {string} Format.
	 */
	get format(): string {
		return this.getAttribute( 'format' ) ?? '$current / $total';
	}

	/**
	 * Set format.
	 *
	 * @param {string} format Format.
	 */
	set format( format: string ) {
		this.setAttribute( 'format', format );
	}

	/**
	 * Attribute changed callback.
	 */
	attributeChangedCallback(): void {
		this.update();
	}

	/**
	 * Update component.
	 */
	update(): void {
		const lightbox: TPLightboxElement | null = this.closest( 'tp-lightbox' );
		if ( ! lightbox ) {
			return;
		}

		const current: string = lightbox.currentIndex.toString();
		const total: string = lightbox.getAttribute( 'total' ) ?? '';

		this.innerHTML =
			this.format
				.replace( '$current', current )
				.replace( '$total', total );

		this.setAttribute( 'current', current );
		this.setAttribute( 'total', total );
	}
}
