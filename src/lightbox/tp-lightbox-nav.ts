/**
 * Internal dependencies.
 */
import { TPLightboxElement } from './tp-lightbox';

/**
 * TP Lightbox Nav.
 */
export class TPLightboxNavElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected template: HTMLTemplateElement | null = null;
	protected lightbox : TPLightboxElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get the template.
		this.template = this.querySelector( 'template' );
		this.lightbox = this.closest( 'tp-lightbox' );

		// Set the template.
		this.lightbox?.addEventListener( 'template-set', this.setTemplate.bind( this ) );
	}

	/**
	 * Set the template.
	 */
	setTemplate(): void {
		// Bail if no template.
		if ( ! this.template ) {
			// Exit.
			return;
		}

		// Total slides.
		const totalSlides = Number( this.lightbox?.getAttribute( 'total' ) ?? 0 );

		// Clear the navigation.
		this.innerHTML = '';

		for ( let i = 0; i < totalSlides; i++ ) {
			// Clone the template.
			const clone = document.importNode( this.template.content, true );

			// Set the index.
			const navItem = clone.querySelector( 'tp-lightbox-nav-item' );
			if ( navItem ) {
				navItem.setAttribute( 'index', i.toString() );
			}

			// Append the clone to the navigation.
			this.appendChild( clone );
		}
	}
}
