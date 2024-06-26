/**
 * TP Toggle Attribute.
 */
export class TPToggleAttributeElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.update();
	}

	/**
	 * Update.
	 */
	update(): void {
		// Get trigger element.
		const triggerSelector: string = this.getAttribute( 'trigger' ) ?? '> *';
		const triggers: NodeListOf<HTMLElement> | null = this.querySelectorAll( triggerSelector );
		if ( ! triggers ) {
			return;
		}

		// Check for value.
		if ( this.hasAttribute( 'value' ) ) {
			triggers.forEach( ( trigger: HTMLElement ) => trigger.addEventListener( 'change', this.valueChanged.bind( this ) ) );
		}
	}

	/**
	 * The value of the target has changed.
	 *
	 * @param {Event} e Change event.
	 */
	valueChanged( e: Event ): void {
		// Check if we're able to detect a value in the target.
		if ( ! e || ! e.currentTarget || ! ( 'value' in e.currentTarget ) ) {
			return;
		}

		// Get value to listen for.
		const value: string = this.getAttribute( 'value' ) ?? '';
		if ( '' === value ) {
			return;
		}

		// Toggle the target's attribute if the target and trigger have the same value.
		if ( e.currentTarget.value === value ) {
			this.toggleTargetAttribute( 'on' );
		} else {
			this.toggleTargetAttribute( 'off' );
		}
	}

	/**
	 * Toggle the target's value on or off.
	 *
	 * @param {string} type Either `on` or `off`.
	 */
	toggleTargetAttribute( type: string = 'on' ): void {
		// Get target.
		const target: HTMLElement | null = this.getTargetElement();
		if ( ! target ) {
			return;
		}

		// First, un-toggle group, if it exists.
		this.unToggleGroup();

		// Next toggle attribute on or off.
		if ( 'on' === type ) {
			target.setAttribute( this.getAttributeName(), this.getAttributeValue() );
		} else {
			target.removeAttribute( this.getAttributeName() );
		}
	}

	/**
	 * Get target element.
	 */
	getTargetElement(): HTMLElement | null {
		// Get target selector.
		const targetSelector: string = this.getAttribute( 'target' ) ?? '';
		if ( '' === targetSelector ) {
			return null;
		}

		// Set default context.
		let context: Document | HTMLElement = document;

		// Check for closest ancestor attribute.
		// If set, the context will be the closest target ancestor.
		// Note: The target's ancestor must also be this element's ancestor!
		const closestSelector: string = this.getAttribute( 'closest-ancestor' ) ?? '';
		if ( '' !== closestSelector ) {
			const closestContext: HTMLElement | null = this.closest( closestSelector );
			if ( closestContext ) {
				context = closestContext;
			}
		}

		// Return the target.
		return context.querySelector( targetSelector );
	}

	/**
	 * Get attribute name to toggle.
	 *
	 * @return {string} The attribute name.
	 */
	getAttributeName(): string {
		return this.getAttribute( 'attribute' ) ?? 'toggled';
	}

	/**
	 * Get attribute value once it is toggled.
	 *
	 * @return {string} The attribute value.
	 */
	getAttributeValue(): string {
		return this.getAttribute( 'attribute-value' ) ?? 'yes';
	}

	/**
	 * Un-toggle the target's group.
	 */
	unToggleGroup(): void {
		// Get group name.
		const groupName: string | null = this.getAttribute( 'group' );
		if ( ! groupName ) {
			return;
		}

		// Get group elements.
		const groupElements: NodeListOf<HTMLElement> | null = document.querySelectorAll( `data-toggle-group[${ groupName }]` );
		if ( ! groupElements ) {
			return;
		}

		// Remove attribute from this group.
		const attributeName: string = this.getAttributeName();
		groupElements.forEach( ( element: HTMLElement ) => element.removeAttribute( attributeName ) );
	}
}
