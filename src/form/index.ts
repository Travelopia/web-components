/**
 * Styles.
 */
import './style.scss';

/**
 * Validators.
 */
import { RequiredValidator, RequiredValidatorError } from './validators/required';
import { MinLengthValidator, MinLengthValidatorError } from './validators/min-length';

/**
 * Register Validators and Errors.
 */
window.tpFormValidators = {
	...RequiredValidator,
	...MinLengthValidator,
};

window.tpFormErrors = {
	...RequiredValidatorError,
	...MinLengthValidatorError,
};

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

