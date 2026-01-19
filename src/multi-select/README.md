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

### `tp-multi-select`

| Attribute       | Required | Values                   | Notes                                                                            |
|-----------------|----------|--------------------------|----------------------------------------------------------------------------------|
| name            | Yes      | <name of the form field> | The name that is given to the form field                                         |
| form            | No       | <id of the form>         | The id of the form with which the select input will be linked                    |
| multiple        | No       | `yes`, `no`              | Whether the field needs to be a single or multi-select form field. Yes by default |
| close-on-select | No       | `yes`                    | Whether to close the options when a value is selected                            |
| aria            | No       | `yes`/`no`               | Manages ARIA attributes automatically. Defaults to `yes`                         |

### `tp-multi-select-pills`

| Attribute     | Required | Values                | Notes                                                                                      |
|---------------|----------|-----------------------|--------------------------------------------------------------------------------------------|
| remove-format | No       | Text with `$label`    | Format for remove button text. Example: `Remove $label` becomes "Remove Japan". Defaults to `x`. |

### `tp-multi-select-search-status`

| Attribute            | Required | Values             | Notes                                                        |
|----------------------|----------|--------------------|--------------------------------------------------------------|
| format               | No       | Text with `$count` | Format for results count. Default: `$count results`          |
| no-results-format    | No       | Text               | Message when no results. Default: `No results found`         |
| no-results-role      | No       | `alert`, `status`  | Role to use when no results (switches from default role)     |
| no-results-aria-live | No       | `assertive`, `polite` | aria-live value when no results                           |

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

## Accessibility

The multi-select component implements the ARIA 1.2 combobox pattern with a listbox popup.

### What the Component Handles

- **`role="combobox"`** — Set on field (or search input if present).
- **`role="listbox"`** — Set on options container.
- **`role="option"`** — Set on each option.
- **`aria-expanded`** — Dynamically updated when dropdown opens/closes.
- **`aria-activedescendant`** — Updated during keyboard navigation.
- **`aria-selected`** — Updated when options are selected/deselected.
- **`aria-multiselectable`** — Set on listbox for multi-select mode.
- **`aria-controls`** — Links combobox to listbox.
- **`tabindex`** — Auto-set on field and options (only if not already present).
- **Label click handling** — Clicking a label with matching `aria-labelledby` focuses the field.

### What You Should Provide

| Attribute          | Element                      | Purpose                                    |
|--------------------|------------------------------|--------------------------------------------|
| `aria-labelledby`  | `tp-multi-select-field` or `input` | Links to the label element ID         |
| `id` + `for`       | `label` + `input`            | Standard label association (for search input) |
| `role="status"`    | `tp-multi-select-status`     | Announces selection count changes          |
| `aria-live`        | Status elements              | Controls announcement behavior             |
| `remove-format`    | `tp-multi-select-pills`      | Text for remove buttons (defaults to `x`)  |

### Keyboard Navigation

| Key        | Action                                           |
|------------|--------------------------------------------------|
| Tab        | Move focus to/from the combobox                  |
| Enter      | Open dropdown (when closed) / Select option      |
| Space      | Open dropdown (when closed) / Select option      |
| Arrow Down | Open dropdown / Navigate to next option          |
| Arrow Up   | Navigate to previous option                      |
| Escape     | Close dropdown                                   |

### Example with Full Accessibility

```html
<label id="countries-label" for="countries-input">Select countries</label>
<tp-multi-select name="countries[]" close-on-select="yes">
	<tp-multi-select-field>
		<tp-multi-select-pills remove-format="Remove $label"></tp-multi-select-pills>
		<tp-multi-select-search>
			<input id="countries-input" type="text" placeholder="Search..." aria-labelledby="countries-label">
		</tp-multi-select-search>
		<tp-multi-select-status class="sr-only" role="status" aria-live="polite" format="$total selected"></tp-multi-select-status>
	</tp-multi-select-field>
	<tp-multi-select-options>
		<tp-multi-select-search-status
			role="status"
			aria-live="polite"
			no-results-role="alert"
			no-results-aria-live="assertive"
			format="$count results"
			no-results-format="No results found">
		</tp-multi-select-search-status>
		<tp-multi-select-option value="japan" label="Japan">Japan</tp-multi-select-option>
		<tp-multi-select-option value="india" label="India">India</tp-multi-select-option>
	</tp-multi-select-options>
</tp-multi-select>
```

### Screen Reader Announcements

- **Selection changes:** Add `role="status"` and `aria-live="polite"` to `tp-multi-select-status` to announce when selection count changes.
- **Search results:** Use `tp-multi-select-search-status` with `role="status"` to announce result counts. Use `no-results-role="alert"` for more urgent "no results" announcements.
- **Remove buttons:** Set `remove-format="Remove $label"` on `tp-multi-select-pills` so the button text becomes "Remove Japan" instead of just "x". Use CSS to visually hide text if you want an icon-only button.
