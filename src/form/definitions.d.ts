import { TPFormFieldElement } from './tp-form-field';

export interface TPFormValidator {
	[ key: string ]: {
		validate: { ( field: TPFormFieldElement ): boolean };
		getErrorMessage: { ( field: TPFormFieldElement ): string };
	}
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
