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
		// Initialize parent.
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.trigger.bind( this ) );
	}

	/**
	 * Trigger the lightbox.
	 */
	trigger(): void {
		// Get lightbox ID and template.
		const lightboxId: string | null = this.getAttribute( 'lightbox' );
		const template: HTMLTemplateElement | null = this.querySelector( 'template' );

		// We can't proceed without them.
		if ( ! lightboxId || ! template ) {
			// Exit.
			return;
		}

		// Get the lightbox.
		const lightbox: TPLightboxElement | null = document.querySelector( `#${ lightboxId.toString() }` );

		// Check to see if we have a lightbox.
		if ( ! lightbox ) {
			// Exit.
			return;
		}

		// Check to see if we have a group.
		const group: string = this.getAttribute( 'group' ) ?? '';

		// Yield to main thread.
		setTimeout( (): void => {
			// Prepare lightbox.
			lightbox.template = template;
			lightbox.group = group;

			// Set index and group if we have them.
			if ( '' !== group ) {
				const allGroups: NodeListOf<TPLightboxTriggerElement> = document.querySelectorAll( `tp-lightbox-trigger[group="${ group }"]` );

				// Update all groups.
				if ( allGroups.length ) {
					/**
					 * We do this when we're opening a lightbox, or navigating.
					 * This allows consumers to inject elements at any point.
					 */
					lightbox.updateAllGroups( allGroups );

					// Get current trigger's index within the group.
					allGroups.forEach( ( triggerElement: TPLightboxTriggerElement, index: number ): void => {
						// Update current index.
						if ( this === triggerElement ) {
							lightbox.currentIndex = index + 1;
						}
					} );
				}
			}

			// All done, lets open the lightbox.
			lightbox.open();
		}, 0 );
	}
}
