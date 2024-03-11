/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';

/**
 * TP Slider Count.
 */
export class TPSliderCountElement extends HTMLElement {
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
		const slider: TPSliderElement | null = this.closest( 'tp-slider' );
		if ( ! slider ) {
			return;
		}

		const current: number = slider.currentSlideIndex - 1 + slider.step;
		const total: string = slider.getAttribute( 'total' ) ?? '';

		this.innerHTML =
			this.format
				.replace( '$current', current.toString() )
				.replace( '$total', total || '' );

		this.setAttribute( 'current', current.toString() );
		this.setAttribute( 'total', total || '' );
	}
}
