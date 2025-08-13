/**
 * Internal dependencies.
 */
import { TPPhoneInputCountryElement } from './tp-phone-input-country';

/**
 * TP Phone Input Country.
 */
export class TPPhoneInputCountryListElement extends HTMLElement {
	handleUpArrow(): void {
		const countries: NodeListOf<TPPhoneInputCountryElement> | null = this.querySelectorAll( 'tp-phone-input-country[focus="yes"]:not([hidden])' );

		for ( let index: number = 0; index < countries.length; index++ ) {
			const country: TPPhoneInputCountryElement = countries[ index ];
			if ( 'yes' === country.getAttribute( 'focus' ) && 0 !== index ) {
				countries[ index - 1 ].removeAttribute( 'focus' );
				this.setAttribute( 'focus', 'yes' );
				break;
			}
		}
	}

	handleDownArrow(): void {
		const countries: NodeListOf<TPPhoneInputCountryElement> | null = this.querySelectorAll( 'tp-phone-input-country' );
		let currentFocusIndex: number = 0;

		for ( let index: number = 0; index < countries.length; index++ ) {
			const country: TPPhoneInputCountryElement = countries[ index ];

			if ( index - 1 === currentFocusIndex ) {
				country.setAttribute( 'focus', 'yes' );
				break;
			}

			if ( 'yes' === country.getAttribute( 'focus' ) ) {
				currentFocusIndex = index;
			}

			country.removeAttribute( 'focus' );
		}
	}
}
