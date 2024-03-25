/**
 * Internal dependencies.
 */
import { TPLightboxContentElement } from './tp-lightbox-content';

/**
 * TP Lightbox.
 */
export class TPLightboxElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected group: string = '';

	/**
	 * Open lightbox with contents of a TEMPLATE tag.
	 *
	 * @param {Object} template HTML template object.
	 * @param {string} group    The lightbox group.
	 */
	open( template: HTMLTemplateElement, group: string = '' ): void {
		const dialog: HTMLDialogElement | null = this.querySelector( 'dialog' );
		const content: TPLightboxContentElement | null = this.querySelector( 'tp-lightbox-content' );

		if ( ! dialog || ! content ) {
			return;
		}

		const templateContent: Node = template.content.cloneNode( true );
		content.replaceChildren( templateContent );

		this.group = group;
		this.prepareNavigation();

		dialog.showModal();
	}

	close(): void {
		const dialog: HTMLDialogElement | null = this.querySelector( 'dialog' );
		dialog?.close();
	}

	previous(): void {
		console.log( 'previous' );
	}

	next(): void {
		console.log( 'next' );
	}

	prepareNavigation(): void {
		console.log( 'prepare nav' );
	}
}
