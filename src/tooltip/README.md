# Tooltip

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

This is a highly customizable tooltip component with full keyboard and screen reader support.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/tooltip';
import '@travelopia/web-components/dist/tooltip/style.css';

// No JavaScript is required to initialise!
```

```html
<!-- Define the tooltip with an ID -->
<tp-tooltip id="my-tooltip" style="width: 300px;">
	<tp-tooltip-content>
		<slot></slot>
	</tp-tooltip-content>
	<tp-tooltip-arrow></tp-tooltip-arrow>
</tp-tooltip>

<!-- Wrap any focusable element with the trigger -->
<tp-tooltip-trigger tooltip="my-tooltip">
	<template>
		<p>This is additional information about the feature.</p>
	</template>
	<button type="button" aria-label="More information">i</button>
</tp-tooltip-trigger>
```

## Attributes

### `tp-tooltip`

| Attribute | Required | Values     | Notes                                                              |
|-----------|----------|------------|--------------------------------------------------------------------|
| offset    | No       | `<number>` | The offset in pixels from the trigger                              |
| aria      | No       | `yes`/`no` | Enables ARIA management. Defaults to `yes`. Set `no` to disable    |

### `tp-tooltip-trigger`

| Attribute | Required | Values     | Notes                                                              |
|-----------|----------|------------|--------------------------------------------------------------------|
| tooltip   | Yes      | `<id>`     | The ID of the tooltip element to display                           |

## Events

| Event | Notes                         |
|-------|-------------------------------|
| show  | After the tooltip is visible  |
| hide  | After the tooltip is hidden   |

## Accessibility

The tooltip component provides mechanical accessibility features, while you control the semantic markup.

### What the Component Handles

- **Keyboard support** — Tooltip appears on focus and disappears on blur.
- **Escape to close** — Pressing Escape dismisses the tooltip.
- **Auto-generated IDs** — Generates a unique ID on the tooltip if not provided.
- **Role assignment** — Sets `role="tooltip"` on the tooltip element.
- **ARIA linking** — Sets `aria-describedby` on the trigger element pointing to the tooltip.

### What You Must Provide

| Attribute | Purpose |
|-----------|---------|
| Focusable trigger | The element inside `tp-tooltip-trigger` must be focusable (`<button>`, `<a>`, or element with `tabindex`). |
| `aria-label` | On the trigger element if it only contains an icon (e.g., an "i" info button). |

### Screen Reader Behavior

When a user focuses the trigger element, the screen reader announces:

1. The trigger's accessible name (text content or `aria-label`)
2. The trigger's role (e.g., "button")
3. The tooltip content (via `aria-describedby`)

Example announcement: *"More information, button, This is additional information about the feature."*

### Important Notes

- **Keep tooltips concise** — Screen readers read the entire `aria-describedby` content without pausing. Users cannot stop and resume; they must refocus to hear it again.
- **No interactive content** — Tooltips should not contain focusable elements like links or buttons. If you need interactive content, use a modal or popover instead.
- **Focus stays on trigger** — Focus never moves to the tooltip content, following the WAI-ARIA tooltip pattern.
