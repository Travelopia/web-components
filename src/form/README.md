# Form

<table width="100%">
	<tr>
		<td align="left" width="70%">
        <p>Built by the super talented team at <strong><a href="https://www.travelopia.com/work-with-us/">Travelopia</a></strong>.</p>
		</td>
		<td align="center" width="30%">
			<img src="https://www.travelopia.com/wp-content/themes/travelopia/assets/svg/logo-travelopia-circle.svg" width="50" />
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

const modal: TPFormElement = document.querySelector( 'tp-form' );
form.resetValidation();
```

```html
<tp-form prevent-submit="yes">
	<form action="#">
		<tp-form-field required="yes">
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
			<button type="submit">Submit</button> <-- There must be a submit button inside this component
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
