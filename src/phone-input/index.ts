/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPPhoneInputElement } from './tp-phone-input';
import { TPPhoneInputCountries } from './tp-phone-input-countries';
import { TPPhoneInputCountry } from './tp-phone-input-country';
import { TPPhoneInputToggle } from './tp-phone-input-toggle';
import { TPPhoneInputField } from './tp-phone-input-field';
import { TPPhoneInputSelect } from './tp-phone-input-select';
import { TPPhoneInputSearch } from './tp-phone-input-search';

/**
 * Register Components.
 */
customElements.define( 'tp-phone-input', TPPhoneInputElement );
customElements.define( 'tp-phone-input-countries', TPPhoneInputCountries );
customElements.define( 'tp-phone-input-country', TPPhoneInputCountry );
customElements.define( 'tp-phone-input-toggle', TPPhoneInputToggle );
customElements.define( 'tp-phone-input-field', TPPhoneInputField );
customElements.define( 'tp-phone-input-select', TPPhoneInputSelect );
customElements.define( 'tp-phone-input-search', TPPhoneInputSearch );
