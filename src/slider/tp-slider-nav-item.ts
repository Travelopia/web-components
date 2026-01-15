/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';
import { TPSliderNavElement } from './tp-slider-nav';

/**
 * TP Slider Nav Item.
 */
export class TPSliderNavItemElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected slider : TPSliderElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.slider = this.closest( 'tp-slider' );

		// Get the nav-item button.
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Get observed attributes.
		return [ 'current' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name      Attribute name.
	 * @param {string} _oldValue Old value.
	 * @param {string} newValue  New value.
	 */
	attributeChangedCallback( name: string, _oldValue: string, newValue: string ): void {
		// Update aria-current on the button when current attribute changes.
		if ( 'current' === name && 'no' !== this.slider?.getAttribute( 'aria' ) ) {
			const button = this.querySelector( 'button' );

			// Check if button exists.
			if ( button ) {
				// Check value.
				if ( 'yes' === newValue ) {
					button.setAttribute( 'aria-current', 'true' );
				} else {
					button.removeAttribute( 'aria-current' );
				}
			}
		}
	}

	/**
	 * Handle when the button is clicked.
	 */
	handleClick(): void {
		// Check if slider exists.
		if ( ! this.slider ) {
			// No its not! Terminate.
			return;
		}

		// Set current slide.
		this.slider.setCurrentSlide( this.getIndex() );
	}

	/**
	 * Get index of this item inside the navigation.
	 *
	 * @return {number} Index.
	 */
	getIndex(): number {
		// Check if we have an index.
		if ( this.getAttribute( 'index' ) ) {
			// Yes, return it.
			return parseInt( this.getAttribute( 'index' ) ?? '0' );
		}

		// Initialize variables.
		const slideNav: TPSliderNavElement | null = this.closest( 'tp-slider-nav' );
		const step = this.slider?.step ?? 1;
		const perView = this.slider?.perView ?? 1;
		const totalSlides = this.slider?.getTotalSlides() ?? 1;
		const index = Array.from( slideNav?.children ?? [] ).indexOf( this );

		// Find posible position of the slide.
		const lastItem = ( totalSlides - perView ) + 1;
		const targetSlide = ( index * step ) + 1;

		// Get the new slide number.
		const currentSlideIndex = Math.min( lastItem, targetSlide );

		// return the index.
		return currentSlideIndex;
	}
}
