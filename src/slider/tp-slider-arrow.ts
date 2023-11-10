/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';

/**
 * TP Slider Arrow.
 */
export class TPSliderArrowElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle when the button is clicked.
	 */
	handleClick(): void {
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			return;
		}

		const slider: TPSliderElement | null = this.closest( 'tp-slider' );
		if ( ! slider ) {
			return;
		}

		if ( 'previous' === this.getAttribute( 'direction' ) ) {
			slider.previous();
		} else if ( 'next' === this.getAttribute( 'direction' ) ) {
			slider.next();
		}
	}
}
