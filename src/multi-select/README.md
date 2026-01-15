# Multi Select

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

This is a highly customizable multi-select component. Pick and choose subcomponents to use, and style as needed!

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/multi-select';
import '@travelopia/web-components/dist/multi-select/style.css';

// TypeScript usage:
import { TPMultiSelectElement } from '@travelopia/web-components';

...

const multiSelect: TPMultiSelectElement = document.querySelector( 'tp-multi-select' );
multiSelect.select( 'value' );
multiSelect.unSelect( 'value' );

const value = multiSelect.value;
```

```html
<!-- Variation 1 -->
<tp-multi-select name="names[]">
	<tp-multi-select-field>
		<tp-multi-select-placeholder>Select...</tp-multi-select-placeholder>
		<tp-multi-select-status format="$total Selected"></tp-multi-select-status>
	</tp-multi-select-field>
	<tp-multi-select-options>
		<tp-multi-select-option value="priya" label="Priya">Priya</tp-multi-select-option>
		<tp-multi-select-option value="varun" label="Varun">Varun</tp-multi-select-option>
		<tp-multi-select-option value="john" label="John">John</tp-multi-select-option>
		<tp-multi-select-option value="jane" label="Jane">Jane</tp-multi-select-option>
	</tp-multi-select-options>
</tp-multi-select>

<!-- Variation 2 -->
<tp-multi-select name="names2[]" close-on-select="yes">
	<tp-multi-select-field>
		<tp-multi-select-pills></tp-multi-select-pills>
		<tp-multi-select-search>
			<input placeholder="Select...">
		</tp-multi-select-search>
	</tp-multi-select-field>
	<tp-multi-select-options>
		<tp-multi-select-select-all select-text="Select All" unselect-text="Un-Select All">Select All</tp-multi-select-select-all>
		<tp-multi-select-option value="priya" label="Priya">Priya</tp-multi-select-option>
		<tp-multi-select-option value="varun" label="Varun">Varun</tp-multi-select-option>
		<tp-multi-select-option value="john" label="John">John</tp-multi-select-option>
		<tp-multi-select-option value="jane" label="Jane">Jane</tp-multi-select-option>
		<tp-multi-select-option value="jack" label="Jack">Jack</tp-multi-select-option>
		<tp-multi-select-option value="jill" label="Jill">Jill</tp-multi-select-option>
	</tp-multi-select-options>
</tp-multi-select>

<!-- Single Select -->
<tp-multi-select name="name" multiple="no" close-on-select="yes">
	<tp-multi-select-field>
		<tp-multi-select-placeholder>Select...</tp-multi-select-placeholder>
		<tp-multi-select-status format="$value"></tp-multi-select-status>
	</tp-multi-select-field>
	<tp-multi-select-options>
		<tp-multi-select-option value="" label="">Select...</tp-multi-select-option>
		<tp-multi-select-option value="priya" label="Priya">Priya</tp-multi-select-option>
		<tp-multi-select-option value="varun" label="Varun">Varun</tp-multi-select-option>
		<tp-multi-select-option value="john" label="John">John</tp-multi-select-option>
		<tp-multi-select-option value="jane" label="Jane">Jane</tp-multi-select-option>
	</tp-multi-select-options>
</tp-multi-select>
```

## Attributes

| Attribute       | Required | Values                   | Notes                                                                            |
|-----------------|----------|--------------------------|----------------------------------------------------------------------------------|
| name            | Yes      | <name of the form field> | The name that is given to the form field                                         |
| form            | No       | <id of the form>         | The id of the form with which the select input will be linked                    |
| multiple        | No       | `yes`, `no`              | Whether the field needs to be a single or mult-select form field. Yes by default |
| close-on-select | No       | `yes`                    | Whether to close the options when a value is selected                            |

## Events

| Event        | Notes                                   |
|--------------|-----------------------------------------|
| open         | When the options are opened             |
| close        | When the options are closed             |
| change       | When any value is selected or unselected |
| select       | When a value is selected                |
| select-all   | When all values are selected            |
| unselect     | When a value is unselected              |
| unselect-all | When all values are unselected          |

## Methods

### `select`

Select a value.

### `unSelect`

Un-select a value.

### `selectAll`

Selects all values.

### `unSelectAll`

Un-select all values.
