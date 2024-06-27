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
		// Get trigger elements.
		const triggerSelector: string = this.getAttribute( 'trigger' ) ?? ':scope > *';
		const triggers: NodeListOf<HTMLElement> | null = this.querySelectorAll( triggerSelector );
		if ( ! triggers ) {
			return;
		}

		// Check for value.
		triggers.forEach( ( trigger: HTMLElement ) => trigger.addEventListener( this.getEvent(), (): void => {
			let value: string | null = null;

			// Check if we have a value.
			if ( ( 'value' in trigger ) && 'string' === typeof trigger.value ) {
				value = trigger.value;
			}

			this.triggerFired( trigger, value );
		} ) );
	}

	/**
	 * Get event.
	 *
	 * @return {string} The event.
	 */
	getEvent(): string {
		return this.getAttribute( 'event' ) ?? 'change';
	}

	/**
	 * Trigger has fired the event.
	 *
	 * @param {HTMLElement} trigger Trigger element.
	 * @param {string}      value   The value of the trigger.
	 */
	triggerFired( trigger: HTMLElement, value: string | null = null ): void {
		// Check if we have a trigger.
		if ( ! trigger ) {
			return;
		}

		// Check if trigger has a value, example: form inputs.
		if ( value && '' !== value ) {
			// Check if we have a value.
			if ( this.hasAttribute( 'value' ) ) {
				this.toggleTargetBasedOnValueAttribute( value );
			} else if ( this.hasAttribute( 'group' ) ) {
				this.toggleTargetGroupBasedOnTriggerValue( value );
			} else {
				this.toggleTargetBasedOnTriggerValue( value );
			}
		} else {
			// Trigger does not have a value, example: buttons.
			this.toggleTargetAttribute();
		}
	}

	/**
	 * Toggle target based on value set on this component.
	 *
	 * @param {string} value Trigger's value.
	 */
	toggleTargetBasedOnValueAttribute( value: string = '' ): void {
		// Get value to listen for.
		const valueAttribute: string = this.getAttribute( 'value' ) ?? '';
		if ( '' === valueAttribute ) {
			return;
		}

		// Toggle the target's attribute if the target and trigger have the same value.
		if ( value === valueAttribute ) {
			this.toggleTargetAttribute( 'on' );
		} else {
			this.toggleTargetAttribute( 'off' );
		}
	}

	/**
	 * Toggle group based on value set on trigger.
	 *
	 * @param {string} value Trigger's value.
	 */
	toggleTargetGroupBasedOnTriggerValue( value: string = '' ): void {
		// Get group elements.
		const groupElements: NodeListOf<HTMLElement> | null = this.getGroupElements();
		if ( ! groupElements ) {
			return;
		}

		// Traverse group elements.
		groupElements.forEach( ( element: HTMLElement ): void => {
			// Toggle on element attribute if it matches the value.
			if ( value === element.getAttribute( 'data-toggle-value' ) ) {
				element.setAttribute( this.getAttributeName(), this.getAttributeValue() );
			} else {
				element.removeAttribute( this.getAttributeName() );
			}
		} );
	}

	/**
	 * Toggle group based on value set on trigger.
	 *
	 * @param {string} value Trigger's value.
	 */
	toggleTargetBasedOnTriggerValue( value: string = '' ): void {
		// Get target.
		const target: HTMLElement | null = this.getTargetElement();
		if ( ! target ) {
			return;
		}

		// First, un-toggle group, if it exists.
		this.unToggleGroup();

		// Next toggle attribute on or off.
		if ( target.getAttribute( 'data-toggle-value' ) === value ) {
			target.setAttribute( this.getAttributeName(), this.getAttributeValue() );
		} else {
			target.removeAttribute( this.getAttributeName() );
		}
	}

	/**
	 * Toggle the target's value on or off.
	 *
	 * @param {string} type Either `on` or `off`.
	 */
	toggleTargetAttribute( type: string = '' ): void {
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
		} else if ( 'off' === type ) {
			target.removeAttribute( this.getAttributeName() );
		} else {
			target.toggleAttribute( this.getAttributeName() );
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

		// Return the target.
		return this.getAncestorContext().querySelector( targetSelector );
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
		// Get group elements.
		const groupElements: NodeListOf<HTMLElement> | null = this.getGroupElements();
		if ( ! groupElements ) {
			return;
		}

		// Remove attribute from this group.
		const attributeName: string = this.getAttributeName();
		groupElements.forEach( ( element: HTMLElement ) => element.removeAttribute( attributeName ) );
	}

	/**
	 * Get group elements.
	 */
	getGroupElements(): NodeListOf<HTMLElement> | null {
		// Get group name.
		const groupName: string | null = this.getAttribute( 'group' );
		if ( ! groupName ) {
			return null;
		}

		// Get group elements.
		return this.getAncestorContext().querySelectorAll( `[data-toggle-group=${ groupName }]` );
	}

	/**
	 * Get ancestor context.
	 */
	getAncestorContext(): Document | HTMLElement {
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

		// Return context.
		return context;
	}
}
