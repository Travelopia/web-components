/**
 * Styles.
 */
import './style.scss';

/**
 * Validators.
 */
import { TPFormValidator } from './definitions';
import * as required from './validators/required';
import * as minLength from './validators/min-length';
import * as maxLength from './validators/max-length';

const validators = [
	required,
	minLength,
	maxLength,
];

/**
 * Register Validators and Errors.
 */
window.tpFormValidators = {};
window.tpFormErrors = {};

validators.forEach( (
	{ name, validator, errorMessage }: { name: string, validator: TPFormValidator, errorMessage: string }
): void => {
	window.tpFormValidators[ name ] = validator;
	window.tpFormErrors[ name ] = errorMessage;
} );

/**
 * Components.
 */
import { TPFormElement } from './tp-form';
import { TPFormFieldElement } from './tp-form-field';
import { TPFormErrorElement } from './tp-form-error';

/**
 * Register Components.
 */
customElements.define( 'tp-form', TPFormElement );
customElements.define( 'tp-form-field', TPFormFieldElement );
customElements.define( 'tp-form-error', TPFormErrorElement );

