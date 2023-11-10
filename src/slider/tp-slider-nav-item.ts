import { TPSliderElement } from './tp-slider';
import { TPSliderNavElement } from './tp-slider-nav';

/**
 * TP Slider Nav Item.
 */
export class TPSliderNavItemElement extends HTMLElement {
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

		slider.setCurrentSlide( this.getIndex() );
	}

	getIndex(): number {
		if ( this.getAttribute( 'index' ) ) {
			return parseInt( this.getAttribute( 'index' ) ?? '0' );
		}

		const slideNav: TPSliderNavElement | null = this.closest( 'tp-slider-nav' );
		return Array.from( slideNav?.children ?? [] ).indexOf( this ) + 1;
	}
}
