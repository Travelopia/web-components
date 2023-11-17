import { TPFormFieldElement } from './tp-form-field';

export interface TPFormValidator {
	[ key: string ]: { ( field: TPFormFieldElement ): boolean };
}

export interface TPFormError {
	[ key: string ]: string;
}

declare global {
	interface Window {
		tpFormValidators: TPFormValidator;
		tpFormErrors: TPFormError;
	}
}
