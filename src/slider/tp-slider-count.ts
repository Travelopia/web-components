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
		// Attributes observed by this component.
		return [ 'format' ];
	}

	/**
	 * Get format.
	 *
	 * @return {string} Format.
	 */
	get format(): string {
		// Get the 'format' attribute value.
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
		// Get slider.
		const slider: TPSliderElement | null = this.closest( 'tp-slider' );

		// Check if slider exists.
		if ( ! slider ) {
			// No its not! Terminate.
			return;
		}

		// Initializing current and total variables.
		const current: number = slider.currentSlideIndex - 1 + slider.step;
		const total: string = slider.getAttribute( 'total' ) ?? '';

		// Updating variables in format attribute.
		this.innerHTML =
			this.format
				.replace( '$current', current.toString() )
				.replace( '$total', total || '' );

		// Updating current and total attributes.
		this.setAttribute( 'current', current.toString() );
		this.setAttribute( 'total', total || '' );
	}
}
