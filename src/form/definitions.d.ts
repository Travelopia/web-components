import { TPFormFieldElement } from './tp-form-field';

export interface TPFormValidator {
	validate: { ( field: TPFormFieldElement ): boolean };
	getErrorMessage: { ( field: TPFormFieldElement ): string };
}

declare global {
	interface Window {
		tpFormValidators: {
			[ key: string ]: TPFormValidator;
		}
		tpFormErrors: {
			[ key: string ]: string;
		};
	}
}
