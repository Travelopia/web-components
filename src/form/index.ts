/**
 * Styles.
 */
import './style.scss';

/**
 * Validators.
 */

// Import validators.
import { TPFormValidator } from './definitions';
import * as required from './validators/required';
import * as email from './validators/email';
import * as minLength from './validators/min-length';
import * as maxLength from './validators/max-length';
import * as noEmptySpaces from './validators/no-empty-spaces';

// Prepare validators.
const validators = [
	required,
	email,
	minLength,
	maxLength,
	noEmptySpaces,
];

/**
 * Register Validators and Errors.
 */
window.tpFormValidators = {};
window.tpFormErrors = {};
window.tpFormSuspenseMessages = {};

// Register validators.
validators.forEach( (
	{ name, validator, errorMessage }: { name: string, validator: TPFormValidator, errorMessage: string }
): void => {
	// Assigning validators and error messages to various fields.
	window.tpFormValidators[ name ] = validator;
	window.tpFormErrors[ name ] = errorMessage;
} );

/**
 * Components.
 */
import { TPFormElement } from './tp-form';
import { TPFormFieldElement } from './tp-form-field';
import { TPFormErrorElement } from './tp-form-error';
import { TPFormSuspenseElement } from './tp-form-suspense';
import { TPFormSubmitElement } from './tp-form-submit';

/**
 * Register Components.
 */
customElements.define( 'tp-form', TPFormElement );
customElements.define( 'tp-form-field', TPFormFieldElement );
customElements.define( 'tp-form-error', TPFormErrorElement );
customElements.define( 'tp-form-suspense', TPFormSuspenseElement );
customElements.define( 'tp-form-submit', TPFormSubmitElement );
