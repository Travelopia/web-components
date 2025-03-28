/**
 * TP Slider Nav.
 */

/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';

/**
 * TP Slider Nav.
 */
export class TPSliderNavElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected template: HTMLTemplateElement | null = null;
	protected slider : TPSliderElement | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Initialize properties.
		this.template = this.querySelector( 'template' );
		this.slider   = this.closest<TPSliderElement>('tp-slider');

		// Apply template if slider is found
		this.setTemplate();

		// Add event listener.
		this.slider?.addEventListener( 'template-set', this.setTemplate.bind( this ) );
	}

	/**
	 * Set the template.
	 */
	setTemplate(): void {
		// Bail if no template.
		if ( ! this.template || ! this.slider ) {
			// Exit.
			return;
		}

		// Total slides.
		const totalSlides = Number( this.slider?.getAttribute( 'total' ) ?? 0 );

		// Clear the navigation.
		this.innerHTML = '';

		// Append the navigation items.
		for ( let i = 1; i <= totalSlides; i++ ) {
			// Clone the template.
			const navItem = this.template.content.cloneNode( true ) as HTMLTemplateElement;

			// Find the button inside and set its text.
			const button = navItem.querySelector('button');
			if ( button ) {
				button.textContent = `${i}`; // Add slide number in button
			}

			// Append the navigation item.
			this.appendChild( navItem );
		}
	}
}
