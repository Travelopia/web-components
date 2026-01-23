# Tabs

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

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/tabs';
import '@travelopia/web-components/dist/tabs/style.css';

// TypeScript usage:
import { TPTabsElement } from '@travelopia/web-components';

...

const tabs: TPTabsElement = document.querySelector( 'tp-tabs' );
tabs.setCurrentTab( 'overview' );
```

### With Links

```html
<tp-tabs current-tab="tab-1" update-url="yes">
	<tp-tabs-nav role="tablist" aria-label="Product information">
		<tp-tabs-nav-item active="yes">
			<a href="#tab-1" role="tab">Tab 1</a>
		</tp-tabs-nav-item>
		<tp-tabs-nav-item>
			<a href="#tab-2" role="tab">Tab 2</a>
		</tp-tabs-nav-item>
		<tp-tabs-nav-item>
			<a href="#tab-3" role="tab">Tab 3</a>
		</tp-tabs-nav-item>
	</tp-tabs-nav>
	<tp-tabs-tab id="tab-1" role="tabpanel" open="yes">
		<p>Tab 1 content...</p>
	</tp-tabs-tab>
	<tp-tabs-tab id="tab-2" role="tabpanel">
		<p>Tab 2 content...</p>
	</tp-tabs-tab>
	<tp-tabs-tab id="tab-3" role="tabpanel">
		<p>Tab 3 content...</p>
	</tp-tabs-tab>
</tp-tabs>
```

### With Buttons

```html
<tp-tabs current-tab="tab-1">
	<tp-tabs-nav role="tablist" aria-label="Product information">
		<tp-tabs-nav-item active="yes">
			<button role="tab" aria-controls="tab-1">Tab 1</button>
		</tp-tabs-nav-item>
		<tp-tabs-nav-item>
			<button role="tab" aria-controls="tab-2">Tab 2</button>
		</tp-tabs-nav-item>
		<tp-tabs-nav-item>
			<button role="tab" aria-controls="tab-3">Tab 3</button>
		</tp-tabs-nav-item>
	</tp-tabs-nav>
	<tp-tabs-tab id="tab-1" role="tabpanel" open="yes">
		<p>Tab 1 content...</p>
	</tp-tabs-tab>
	<tp-tabs-tab id="tab-2" role="tabpanel">
		<p>Tab 2 content...</p>
	</tp-tabs-tab>
	<tp-tabs-tab id="tab-3" role="tabpanel">
		<p>Tab 3 content...</p>
	</tp-tabs-tab>
</tp-tabs>
```

## Attributes

| Attribute   | Required | Values                  | Notes                                                      |
|-------------|----------|-------------------------|------------------------------------------------------------|
| current-tab | Yes      | (id of the current tab) | This attribute controls which tab is currently open        |
| update-url  | No       | `yes`                   | Whether or not to update the hash in the URL               |
| aria        | No       | `yes`/`no`              | Manages ARIA attributes automatically. Defaults to `yes`.  |

## Events

| Event  | Notes                  |
|--------|------------------------|
| change | When a tab has changed |

## Methods

### `setCurrentTab`

Move to the tab with the given id.

## Accessibility

The tabs component provides accessibility features while you control the semantic markup.

This component follows the [WAI-ARIA Tabs with Automatic Activation Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/).

### What the Component Handles

- **`aria-selected`** on tab triggers — Automatically set based on active state.
- **`tabindex` (roving)** — Active trigger has `tabindex="0"`, inactive triggers have `tabindex="-1"`.
- **`aria-controls`** on triggers — Automatically links triggers to their panels.
- **`aria-labelledby`** on panels — Automatically links panels to their triggers.
- **`aria-hidden` / `inert`** on inactive panels — Hidden from assistive technology.
- **`tabindex="0"`** on active panel — Makes panel content focusable.
- **Keyboard navigation** — Arrow Left/Right to navigate tabs, Home/End for first/last.

### What You Should Provide

| Attribute                    | Element         | Purpose                              |
|------------------------------|-----------------|--------------------------------------|
| `role="tablist"`             | `tp-tabs-nav`   | Identifies the tab list              |
| `role="tab"`                 | `a` or `button` | Identifies each tab trigger          |
| `role="tabpanel"`            | `tp-tabs-tab`   | Identifies each tab panel            |
| `aria-label`                 | `tp-tabs-nav`   | Describes the tablist purpose        |

### Keyboard Navigation

| Key         | Action                                      |
|-------------|---------------------------------------------|
| Tab         | Move focus into/out of the tablist          |
| Arrow Left  | Move to previous tab (wraps around)         |
| Arrow Right | Move to next tab (wraps around)             |
| Home        | Move to first tab                           |
| End         | Move to last tab                            |

The tablist uses "roving tabindex" — it acts as a single tab stop. Use Arrow keys to navigate between tabs, then Tab to move into the panel content.
