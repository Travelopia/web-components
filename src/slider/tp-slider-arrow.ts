import { TPSliderElement } from './tp-slider';

/**
 * TP Slider Arrow.
 */
export class TPSliderArrowElement extends HTMLElement {
	constructor() {
		super();

		if ( ! this.getAttribute( 'tabindex' ) ) {
			this.tabIndex = 0;
		}
	}

	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.setAttribute( 'role', 'button' );
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle when the component is clicked.
	 */
	handleClick(): void {
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
