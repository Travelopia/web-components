/**
 * TP Slider Count.
 */
export class TPSliderCountElement extends HTMLElement {
	static get observedAttributes(): string[] {
		return [ 'current', 'total', 'format' ];
	}

	get format(): string {
		return this.getAttribute( 'format' ) ?? '$1 / $2';
	}

	set format( format ) {
		this.setAttribute( 'format', format );
	}

	attributeChangedCallback(): void {
		this.update();
	}

	update(): void {
		this.innerHTML =
			this.format
				.replace( '$1', this.getAttribute( 'current' ) ?? '' )
				.replace( '$2', this.getAttribute( 'total' ) ?? '' );
	}
}
