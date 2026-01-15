# Accordion

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

| Attribute       | Required | Values     | Notes                                                            |
|-----------------|----------|------------|------------------------------------------------------------------|
| collapse-all    | No       | `yes`      | This attribute controls if all accordion items should be closed |
| expand-all      | No       | `yes`      | This attribute controls if all accordion items should be opened |
| aria            | No       | `yes`/`no` | Manages ARIA attributes automatically. Defaults to `yes`        |

## Events

| Event        | Notes                                  |
|--------------|----------------------------------------|
| collapse-all | When all accordion items are collapsed |
| expand-all   | When all accordion items are expanded  |
| before-open  | Immediately before an item is opened   |
| open         | When an item is opened                 |
| before-close | Immediately before an item is closed   |
| close        | When an item is closed                 |

## Methods

### `open`
Open an accordion item.

### `close`
Close an accordion item.

## Accessibility

The accordion component provides mechanical accessibility features while you control the semantic markup.

### What the Component Handles

- **`aria-expanded`** — Sets `true`/`false` on the handle button based on open state.
- **`aria-controls`** — Auto-generates IDs and links buttons to their content panels (if not provided).
- **`hidden="until-found"`** — Closed content is searchable via browser find-in-page (Ctrl+F/Cmd+F). When a match is found, the panel auto-expands.

### Find-in-Page Support

The accordion uses `hidden="until-found"` to enable browser find-in-page functionality on collapsed panels:

1. User presses Ctrl+F and searches for text
2. Browser finds matches even in collapsed panels
3. Panel auto-expands to reveal the match

**Browser support:** Chrome, Edge, Firefox. Safari support expected by end of 2025.
**Fallback:** Browsers without support hide content normally (not searchable, but still functional).

### What You Should Provide

| Attribute | Purpose |
|-----------|---------|
| Button labels | Descriptive text for each accordion trigger |

### Example with Headings

For accordions with headings, place the button inside the heading to preserve heading semantics:

```html
<tp-accordion>
	<tp-accordion-item>
		<tp-accordion-handle>
			<h3><button>Section Title</button></h3>
		</tp-accordion-handle>
		<tp-accordion-content>
			<p>Content here...</p>
		</tp-accordion-content>
	</tp-accordion-item>
</tp-accordion>
```
