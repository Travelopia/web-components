# Tabs

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

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/accordion';
import '@travelopia/web-components/dist/accordion/style.css';

// TypeScript usage:
import { TPAccordionItemElement } from '@travelopia/web-components';

...

const accordionItem: TPAccordionItemElement = document.querySelector( 'tp-accordion-item' );
accordionItem.open();
accordionItem.close();
```

```html
<tp-accordion>
	<tp-accordion-expand-all>
		<button>Expand All</button>
	</tp-accordion-expand-all>
	<tp-accordion-collapse-all>
		<button>Collapse All</button>
	</tp-accordion-collapse-all>

	<tp-accordion-item open-by-default="yes">
		<tp-accordion-handle>
			<button>Accordion title</button>
		</tp-accordion-handle>
		<tp-accordion-content>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</tp-accordion-content>
	</tp-accordion-item>
	<tp-accordion-item>
		<tp-accordion-handle>
			<button>Accordion title</button>
		</tp-accordion-handle>
		<tp-accordion-content>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</tp-accordion-content>
	</tp-accordion-item>
	<tp-accordion-item>
		<tp-accordion-handle>
			<button>Accordion title</button>
		</tp-accordion-handle>
		<tp-accordion-content>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</tp-accordion-content>
	</tp-accordion-item>
</tp-accordion>
```

## Attributes

| Attribute       | Required | Values        | Notes                                                             |
|-----------------|----------|---------------|-------------------------------------------------------------------|
| collapse-all    | No       | `yes` | This attribute controls if all accordion items should be closed.  |
| collapse-all    | No       | `yes` | This attribute controls if all accordion items should be closed.  |

## Events

| Event        | Notes                                  |
|--------------|----------------------------------------|
| collapse-all | When all accordion items are collapsed |
| expand-all   | When all accordion items are expanded  |

## Methods

### `open`
Open an accordion item.

### `close`
Close an accordion item.
