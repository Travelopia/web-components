/**
 * Internal dependencies.
 */
import { TPLightboxElement } from './tp-lightbox';

/**
 * TP Lightbox Trigger.
 */
export class TPLightboxTriggerElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.trigger.bind( this ) );
	}

	/**
	 * Trigger the lightbox.
	 */
	trigger(): void {
		const lightboxId: string | null = this.getAttribute( 'lightbox' );
		const template: HTMLTemplateElement | null = this.querySelector( 'template' );

		if ( ! lightboxId || ! template ) {
			return;
		}

		const lightbox: TPLightboxElement | null = document.querySelector( `#${ lightboxId.toString() }` );
		if ( ! lightbox ) {
			return;
		}

		setTimeout( (): void => {
			lightbox.template = template;
			lightbox.group = this.getAttribute( 'group' ) ?? '';
			lightbox.open();
		}, 0 );
	}
}
