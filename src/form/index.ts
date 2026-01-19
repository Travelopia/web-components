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
import * as zip from './validators/zip';

// Prepare validators.
const validators = [
	required,
	email,
	minLength,
	maxLength,
	noEmptySpaces,
	zip,
];

/**
 * Register Validators and Errors.
 */
window.tpFormValidators = {};
window.tpFormErrors = {};
window.tpFormSummaryErrors = {};
window.tpFormSuspenseMessages = {};

// Register validators.
validators.forEach( (
	{ name, validator, errorMessage, summaryErrorMessage }: { name: string, validator: TPFormValidator, errorMessage: string, summaryErrorMessage?: string }
): void => {
	// Assigning validators and error messages to various fields.
	window.tpFormValidators[ name ] = validator;
	window.tpFormErrors[ name ] = errorMessage;

	// Register summary error message if provided.
	if ( summaryErrorMessage ) {
		window.tpFormSummaryErrors[ name ] = summaryErrorMessage;
	}
} );

/**
 * Components.
 */
import { TPFormElement } from './tp-form';
import { TPFormFieldElement } from './tp-form-field';
import { TPFormErrorElement } from './tp-form-error';
import { TPFormErrorsElement } from './tp-form-errors';
import { TPFormErrorsHeadingElement } from './tp-form-errors-heading';
import { TPFormErrorsListElement } from './tp-form-errors-list';
import { TPFormErrorsErrorElement } from './tp-form-errors-error';
import { TPFormSuspenseElement } from './tp-form-suspense';
import { TPFormSubmitElement } from './tp-form-submit';

/**
 * Register Components.
 */
customElements.define( 'tp-form', TPFormElement );
customElements.define( 'tp-form-field', TPFormFieldElement );
customElements.define( 'tp-form-error', TPFormErrorElement );
customElements.define( 'tp-form-errors', TPFormErrorsElement );
customElements.define( 'tp-form-errors-heading', TPFormErrorsHeadingElement );
customElements.define( 'tp-form-errors-list', TPFormErrorsListElement );
customElements.define( 'tp-form-errors-error', TPFormErrorsErrorElement );
customElements.define( 'tp-form-suspense', TPFormSuspenseElement );
customElements.define( 'tp-form-submit', TPFormSubmitElement );
