/**
 * Internal dependencies.
 */
import { TPFormFieldElement } from './tp-form-field';

/**
 * Form Validator.
 */
export interface TPFormValidator {
	validate: { ( field: TPFormFieldElement ): boolean | Promise<boolean> };
	getErrorMessage: { ( field: TPFormFieldElement ): string };
	getSuspenseMessage?: { ( field: TPFormFieldElement ): string };
	getSummaryMessage?: { ( field: TPFormFieldElement ): string };
}

/**
 * Window.
 */
declare global {
	// Declare interface for validators and errors.
	interface Window {
		tpFormValidators: {
			[ key: string ]: TPFormValidator;
		}
		tpFormErrors: {
			[ key: string ]: string;
		};
		tpFormSummaryErrors: {
			[ key: string ]: string;
		};
		tpFormSuspenseMessages: {
			[ key: string ]: string;
		};
	}
}
