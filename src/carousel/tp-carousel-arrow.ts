/**
 * Internal dependencies.
 */
import { TPCarouselElement } from './tp-carousel';

/**
 * TP Carousel Arrow.
 */
export class TPCarouselArrowElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Call the parent constructor.
		super();

		// Get the button and add event listener.
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle when the button is clicked.
	 */
	handleClick(): void {
		// If disabled, do nothing.
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			// Early return.
			return;
		}

		// Get the carousel.
		const carousel: TPCarouselElement | null = this.closest( 'tp-carousel' );

		// If no carousel, early return.
		if ( ! carousel ) {
			// Early return.
			return;
		}

		// Initiate carousel according to the direction of the button clicked.
		if ( 'previous' === this.getAttribute( 'direction' ) ) {
			carousel.previous();
		} else if ( 'next' === this.getAttribute( 'direction' ) ) {
			carousel.next();
		}
	}
}
