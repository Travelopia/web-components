import { TPFormFieldElement } from './tp-form-field';

/**
 * TP Form.
 */
export class TPFormElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected readonly form: HTMLFormElement | null;

	constructor() {
		super();
		this.form = this.querySelector( 'form' );
	}

	connectedCallback(): void {
		this.form?.addEventListener( 'submit', this.handleFormSubmit.bind( this ) );
	}

	protected handleFormSubmit( e: SubmitEvent ): void {
		const formValid: boolean = this.validate();
		if ( ! formValid || 'yes' === this.getAttribute( 'prevent-submit' ) ) {
			e.preventDefault();
		}
	}

	validate(): boolean {
		this.dispatchEvent( new CustomEvent( 'validate', { bubbles: true } ) );

		const fields: NodeListOf<TPFormFieldElement> | null = this.querySelectorAll( 'tp-form-field' );
		if ( ! fields ) {
			this.dispatchEvent( new CustomEvent( 'validation-success', { bubbles: true } ) );
			return true;
		}

		let formValid: boolean = true;
		fields.forEach( ( field: TPFormFieldElement ): void => {
			if ( ! field.validate() ) {
				formValid = false;
			}
		} );

		if ( formValid ) {
			this.dispatchEvent( new CustomEvent( 'validation-success', { bubbles: true } ) );
		} else {
			this.dispatchEvent( new CustomEvent( 'validation-error', { bubbles: true } ) );
		}

		return formValid;
	}

	resetValidation(): void {
		const fields: NodeListOf<TPFormFieldElement> | null = this.querySelectorAll( 'tp-form-field' );
		if ( ! fields ) {
			return;
		}

		fields.forEach( ( field: TPFormFieldElement ): void => {
			field.removeAttribute( 'valid' );
			field.removeAttribute( 'error' );
		} );
	}
}
