/**
 * TP Slider Count.
 */
export class TPSliderCountElement extends HTMLElement {
	static get observedAttributes(): string[] {
		return [ 'current', 'total', 'format' ];
	}

	get format(): string {
		return this.getAttribute( 'format' ) ?? '$current / $total';
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
				.replace( '$current', this.getAttribute( 'current' ) ?? '' )
				.replace( '$total', this.getAttribute( 'total' ) ?? '' );
	}
}
