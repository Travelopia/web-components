# Form

<table width="100%">
	<tr>
		<td align="left" width="70%">
        <p>Built by the super talented team at <strong><a href="https://www.travelopia.com/work-with-us/">Travelopia</a></strong>.</p>
		</td>
		<td align="center" width="30%">
			<img src="https://www.travelopia.com/wp-content/themes/travelopia/src/assets/svg/logo-travelopia-circle.svg" width="50" />
		</td>
	</tr>
</table>

## Sample Usage

This is a form component that is designed to be highly extendable. It includes validation, and the ability to easily add custom validators.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/form';

// TypeScript usage:
import { TPFormElement, TPFormFieldElement, TPFormErrorElement, TPFormSubmitElement } from '@travelopia/web-components';

...

const form: TPFormElement = document.querySelector( 'tp-form' );
form.resetValidation();
```

```html
<tp-form prevent-submit="yes">
	<form action="#">
		<tp-form-field required="yes" revalidate-on-change="no"> <!-- If you don't want to revalidate as the value changes -->
			<label>Field 1</label>
			<input type="text" name="field_1">
		</tp-form-field>
		<tp-form-field required="yes" email="yes">
			<label>Field 2</label>
			<input type="email" name="field_2">
		</tp-form-field>
		<tp-form-field required="yes">
			<label>Field 3</label>
			<select type="text" name="field_3">
				<option value="">Select value</option>
				<option value="value_1">Value 1</option>
				<option value="value_2">Value 2</option>
				<option value="value_3">Value 3</option>
			</select>
		</tp-form-field>
		<tp-form-field min-length="4" max-length="8">
			<label>Field 4</label>
			<textarea name="field_4"></textarea>
		</tp-form-field>
		<tp-form-submit submitting-text="Submitting...">
			<button type="submit">Submit</button> <!-- There must be a submit button inside this component -->
		</tp-form-submit>
	</form>
</tp-form>
```

## Attributes

| Attribute      | Required | Values | Notes                                                                     |
|----------------|----------|--------|---------------------------------------------------------------------------|
| prevent-submit | No       | `yes`  | Whether to prevent the submission of the form if validation is successful |

## Events

| Event              | Notes                                   |
|--------------------|-----------------------------------------|
| validate           | Right before validating the form.       |
| validation-success | When the form is successfully validated |
| validation-error   | When any field in the form is invalid   |

## Methods

### `validate`

Validates the form.

### `resetValidation`

Removes all validation errors from the form.

## Error Summary

For accessible form validation, you can add an error summary that lists all validation errors with links to the invalid fields. This follows the [GOV.UK design system pattern](https://design-system.service.gov.uk/components/error-summary/).

The component provides maximum flexibility — you control the markup structure.

```html
<tp-form prevent-submit="yes">
	<form action="#">
		<tp-form-errors>
			<p><tp-form-errors-heading format="$count error(s) found"></tp-form-errors-heading></p>
			<tp-form-errors-list role="list"></tp-form-errors-list>
		</tp-form-errors>
		<!-- form fields here -->
	</form>
</tp-form>
```

### Components

| Component | Purpose |
|-----------|---------|
| `tp-form-errors` | Container. Sets `active="yes"` when errors exist. |
| `tp-form-errors-heading` | Displays error count. Use `format` attribute with `$count` placeholder. |
| `tp-form-errors-list` | Contains the list of error links. Add `role="list"` for accessibility. |
| `tp-form-errors-error` | Generated for each error. Has `role="listitem"` auto-applied. |

### Visibility

The error summary is hidden by default. Use CSS to show it when `active="yes"`:

```css
tp-form-errors {
	display: none;
}

tp-form-errors[active="yes"] {
	display: block;
}
```

### Numbering with CSS Counters

Use CSS counters to number the error list:

```css
tp-form-errors-list {
	counter-reset: errors;
}

tp-form-errors-error {
	display: block;
	counter-increment: errors;
}

tp-form-errors-error::before {
	content: counter(errors) ". ";
}
```

### Focus Management

- If `tp-form-errors` exists: Focus moves to the error summary on validation failure
- If `tp-form-errors` doesn't exist: Focus moves to the first visible invalid field

## Accessibility

The form component provides accessibility features while you control the semantic markup.

### What the Component Handles

- **Auto-generates IDs** on form fields if not present
- **Auto-sets `for` attribute** on labels if not present
- **`aria-invalid`** on fields when validation fails
- **`aria-describedby`** linking fields to error messages
- **`role="alert"`** on dynamically created error messages
- **`role="listitem"`** on error summary list items
- **Focus management** to error summary or first visible invalid field

### What You Should Provide

| Attribute | Purpose |
|-----------|---------|
| `aria-required="true"` | On required inputs for screen reader announcements |
| `role="list"` | On `tp-form-errors-list` for proper list semantics |

## Internationalization (i18n)

### Inline Error Messages

Customize inline error messages via `window.tpFormErrors`:

```js
window.tpFormErrors['required'] = 'Ce champ est obligatoire';
window.tpFormErrors['email'] = 'Veuillez entrer une adresse email valide';
```

### Summary Error Messages

Customize summary error messages via `window.tpFormSummaryErrors`. Use `%label%` as a placeholder for the field label:

```js
window.tpFormSummaryErrors['required'] = '%label% est obligatoire';
window.tpFormSummaryErrors['email'] = '%label%: Veuillez entrer une adresse email valide';
```

### Built-in Validators

| Validator | Default Error Message | Default Summary Message |
|-----------|----------------------|-------------------------|
| `required` | This field is required | %label% is required |
| `email` | Please enter a valid email address | %label%: Please enter a valid email address |
| `min-length` | Must be at least %1 characters | %label%: Must be at least %1 characters |
| `max-length` | Must be less than %1 characters | %label%: Must be less than %1 characters |
| `no-empty-spaces` | This field should not contain only white-spaces | %label%: Should not contain only white-spaces |
| `zip` | Please enter a valid zip code | %label%: Please enter a valid zip code |

## Custom Validators

Add custom validators to `window.tpFormValidators`:

```js
window.tpFormValidators['my-validator'] = {
	validate: (field) => {
		// validation logic
		return true;
	},
	// Inline error message (shown next to field)
	getErrorMessage: (field) => 'This field is invalid',
	// Summary error message (shown in error summary, optional)
	getSummaryMessage: (field) => {
		const label = field.querySelector('label')?.textContent || 'Field';
		return `${label} is invalid`;
	},
};
```

If `getSummaryMessage` is not defined, the component falls back to `getErrorMessage`.
