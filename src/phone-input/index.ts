/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPPhoneInputElement } from './tp-phone-input';
import { TPPhoneInputSearchElement } from './tp-phone-input-search';
import { TPPhoneInputPhoneCodeElement } from './tp-phone-input-phone-code';
import { TPPhoneInputCountriesElement } from './tp-phone-input-countries';
import { TpPhoneInputSelectedFlagElement } from './tp-phone-input-selected-flag';
import { TPPhoneInputCountryElement } from './tp-phone-input-country';
import { TPPhoneInputFieldElement } from './tp-phone-input-field';

/**
 * Register Components.
 */
customElements.define( 'tp-phone-input-selected-flag', TpPhoneInputSelectedFlagElement );
customElements.define( 'tp-phone-input-country', TPPhoneInputCountryElement );
customElements.define( 'tp-phone-input-field', TPPhoneInputFieldElement );
customElements.define( 'tp-phone-input', TPPhoneInputElement );
customElements.define( 'tp-phone-input-search', TPPhoneInputSearchElement );
customElements.define( 'tp-phone-input-phone-code', TPPhoneInputPhoneCodeElement );
customElements.define( 'tp-phone-input-countries', TPPhoneInputCountriesElement );
