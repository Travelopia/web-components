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

This is a number spinner component that is designed to be highly extendable.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/number-spinner';

// TypeScript usage:
import { TPNumberSpinner, TPNumberSpinnerInput, TPNumberSpinnerIncrement, TPNumberSpinnerDecrement } from '@travelopia/web-components';

```

```html
<tp-number-spinner>
	<tp-number-spinner-decrement><button type="button">-</button></tp-number-spinner-decrement>
	<tp-number-spinner-input>
		<input type="number" min="0" max="100" step="1" value="0" readonly />
	</tp-number-spinner-input>
	<tp-number-spinner-increment><button type="button">+</button></tp-number-spinner-increment>
</tp-number-spinner>
```
