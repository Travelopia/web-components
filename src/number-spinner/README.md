# Number Spinner

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

A number spinner component with increment/decrement buttons and full keyboard and screen reader support following the WAI-ARIA spinbutton pattern.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/number-spinner';
import '@travelopia/web-components/dist/number-spinner/style.css';

// TypeScript usage:
import { TPNumberSpinner, TPNumberSpinnerInput, TPNumberSpinnerIncrement, TPNumberSpinnerDecrement } from '@travelopia/web-components';
```

```html
<label id="quantity-label">Quantity</label>
<tp-number-spinner min="0" max="10">
	<tp-number-spinner-decrement>
		<button type="button" aria-label="Decrease quantity">-</button>
	</tp-number-spinner-decrement>
	<tp-number-spinner-input>
		<input type="number" value="0" readonly aria-labelledby="quantity-label" />
	</tp-number-spinner-input>
	<tp-number-spinner-increment>
		<button type="button" aria-label="Increase quantity">+</button>
	</tp-number-spinner-increment>
</tp-number-spinner>
```

## Attributes

| Attribute | Required | Values     | Notes                                                           |
|-----------|----------|------------|-----------------------------------------------------------------|
| min       | No       | `<number>` | The minimum value of the spinner                                |
| max       | No       | `<number>` | The maximum value of the spinner                                |
| step      | No       | `<number>` | The step increment. Defaults to `1`                             |
| aria      | No       | `yes`/`no` | Enables ARIA management. Defaults to `yes`. Set `no` to disable |

## Accessibility

The number spinner follows the [WAI-ARIA Spinbutton Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/).

### What the Component Handles

| Feature | Details |
|---------|---------|
| `role="spinbutton"` | Set on the input element |
| `aria-valuenow` | Current value, updated on each change |
| `aria-valuemin` | Minimum value (if defined) |
| `aria-valuemax` | Maximum value (if defined) |
| `tabindex="-1"` | Set on buttons (if not already set by consumer) |
| `aria-disabled` | Set on buttons when at min/max limits |
| Arrow Up/Down | Increment/decrement value |
| Home/End | Jump to min/max value |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Up | Increase value by step |
| Arrow Down | Decrease value by step |
| Home | Set to minimum value |
| End | Set to maximum value |

### What You Must Provide

| Attribute | Purpose |
|-----------|---------|
| `aria-labelledby` on input | Links to the visible label |
| `aria-label` on buttons | Descriptive labels for mouse users (e.g., "Decrease quantity") |
| `readonly` on input | Recommended to prevent typing; buttons/arrows control value |

### Tab Order

The component uses a single tab stop (the input). Buttons have `tabindex="-1"` so they're clickable but not in the tab order. This follows the WAI-ARIA pattern where the spinbutton itself receives focus and arrow keys control the value.

### Screen Reader Experience

When focused on the input:
- Announces: label, role ("spinbutton"), current value, min/max range
- After arrow key: announces new value

When buttons are at limits:
- `aria-disabled="true"` indicates the button cannot be used

### Example with All Accessibility Features

```html
<label id="guests-label">Number of guests</label>
<tp-number-spinner min="1" max="20" step="1">
	<tp-number-spinner-decrement>
		<button type="button" aria-label="Remove guest">-</button>
	</tp-number-spinner-decrement>
	<tp-number-spinner-input>
		<input type="number" value="1" readonly aria-labelledby="guests-label" />
	</tp-number-spinner-input>
	<tp-number-spinner-increment>
		<button type="button" aria-label="Add guest">+</button>
	</tp-number-spinner-increment>
</tp-number-spinner>
```
