/**
 * TP Toggle Attribute.
 */
export class TPToggleAttributeElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Call the parent constructor.
		super();

		// Call the update function to set up event listeners.
		this.update();
	}

	/**
	 * Update.
	 */
	update(): void {
		// Get trigger elements.
		const triggerSelector: string = this.getAttribute( 'trigger' ) ?? ':scope > *';
		const triggers: NodeListOf<HTMLElement> | null = this.querySelectorAll( triggerSelector );

		// Exit the function if no triggers are found.
		if ( ! triggers ) {
			// Early return.
			return;
		}

		// Check for value.
		triggers.forEach( ( trigger: HTMLElement ) => trigger.addEventListener( this.getEvent(), (): void => {
			// Set value.
			let value: string | null = null;

			// Check if we have a value.
			if ( [ 'INPUT', 'SELECT', 'TEXTAREA' ].includes( trigger.tagName ) && ( 'value' in trigger ) && 'string' === typeof trigger.value ) {
				value = trigger.value;
			}

			// Call the triggerFired function with the trigger element and its value.
			this.triggerFired( trigger, value );
		} ) );
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
			// Early return.
			return;
		}

		// Dispatch event.
		this.dispatchEvent( new CustomEvent( 'triggered' ) );

		// Check if trigger has a value, example: form inputs.
		if ( value || '' === value ) {
			// Check if we have a value.
			if ( this.hasAttribute( 'value' ) ) {
				this.toggleByValueAttribute( value );
			} else {
				this.toggleByTargetDataValue( value );
			}
		} else {
			// Trigger does not have a value, example: buttons.
			this.toggleWithoutValue();
		}
	}

	/**
	 * Toggle target based on value attribute set on this component.
	 *
	 * @param {string} value Trigger's value.
	 */
	toggleByValueAttribute( value: string = '' ): void {
		// Get value to listen for.
		const values: string[] = ( this.getAttribute( 'value' ) ?? '' ).split( ',' );

		// Get the target elements.
		const targetElements = this.getTargetElements();

		// Check if we can continue
		if ( ! ( values.length && targetElements ) ) {
			// We can't.
			return;
		}

		// Toggle the target elements.
		targetElements.forEach( ( target ) => {
			// Toggle the target's attribute if the target and trigger have the same value.
			if ( values.includes( value ) ) {
				this.toggleTargetAttribute( target, 'on' );
			} else {
				this.toggleTargetAttribute( target, 'off' );
			}
		} );
	}

	/**
	 * Toggle target based on `data-toggle-value` set on target.
	 *
	 * @param {string} value Trigger's value.
	 */
	toggleByTargetDataValue( value: string = '' ): void {
		// Get the target elements.
		const targetElements = this.getTargetElements();

		// Check if we can continue
		if ( ! targetElements ) {
			// We can't.
			return;
		}

		// Toggle the target elements.
		targetElements.forEach( ( target: HTMLElement ): void => {
			// Get values and split them. Set an empty array otherwise.
			const values: string[] = ( target.getAttribute( 'data-toggle-value' ) )?.split( ',' ) ?? [];

			// Toggle on element attribute if it matches value or it does not have a data-toggle-value attribute in which case it will match with all non empty values.
			if ( values.includes( value ) || ( ! values.length && value ) ) {
				this.toggleTargetAttribute( target, 'on' );
			} else {
				this.toggleTargetAttribute( target, 'off' );
			}
		} );
	}

	/**
	 * Toggle the target without any value.
	 */
	toggleWithoutValue(): void {
		// Get the target elements.
		const targetElements = this.getTargetElements();

		// Check if we can continue
		if ( ! targetElements ) {
			// We can't.
			return;
		}

		// Toggle the target elements.
		targetElements.forEach( ( target: HTMLElement ): void => {
			// Toggle on element attribute if it matches the value.
			this.toggleTargetAttribute( target );
		} );
	}

	/**
	 * Toggle the target's value on or off.
	 *
	 * @param {HTMLElement} target The target element.
	 * @param {string}      type   Either `on` or `off`.
	 */
	toggleTargetAttribute( target: HTMLElement | null = null, type: string = '' ): void {
		// Check if target exists.
		if ( ! target ) {
			// Early return.
			return;
		}

		// Next toggle attribute on or off.
		if ( 'on' === type ) {
			target.setAttribute( this.getAttributeName(), this.getAttributeValue() );
			this.dispatchEvent( new CustomEvent( 'toggled-on' ) );
		} else if ( 'off' === type ) {
			target.removeAttribute( this.getAttributeName() );
			this.dispatchEvent( new CustomEvent( 'toggled-off' ) );
		} else {
			target.toggleAttribute( this.getAttributeName() );
			this.dispatchEvent( new CustomEvent( 'toggled' ) );
		}
	}

	/**
	 * Get target element.
	 */
	getTargetElements(): NodeListOf<HTMLElement> | null {
		// Get target selector.
		const targetSelector: string = this.getAttribute( 'target' ) ?? '';

		// Check if we have a target selector.
		if ( '' === targetSelector ) {
			// Return null if no target selector is provided.
			return null;
		}

		// Return the target.
		return this.getAncestorContext().querySelectorAll( targetSelector );
	}

	/**
	 * Get attribute name to toggle.
	 *
	 * @return {string} The attribute name.
	 */
	getAttributeName(): string {
		// Return the attribute name from the 'attribute' attribute or default to 'toggled'.
		return this.getAttribute( 'attribute' ) ?? 'toggled';
	}

	/**
	 * Get attribute value once it is toggled.
	 *
	 * @return {string} The attribute value.
	 */
	getAttributeValue(): string {
		// Return the attribute value from the 'attribute-value' attribute or default to 'yes'.
		return this.getAttribute( 'attribute-value' ) ?? 'yes';
	}

	/**
	 * Get event.
	 *
	 * @return {string} The event.
	 */
	getEvent(): string {
		// Return the event type from the 'event' attribute or default to 'change'.
		return this.getAttribute( 'event' ) ?? 'change';
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

		// Find the closest ancestor matching the selector.
		if ( '' !== closestSelector ) {
			const closestContext: HTMLElement | null = this.closest( closestSelector );

			// Check if we can continue
			if ( closestContext ) {
				context = closestContext;
			}
		}

		// Return context.
		return context;
	}
}
