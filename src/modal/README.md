# Modal

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

This is a super minimal modal that is designed to be highly extendable.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/modal';
import '@travelopia/web-components/dist/modal/style.css';

// TypeScript usage:
import { TPModalElement, TPModalCloseElement } from '@travelopia/web-components';

...

const modal: TPModalElement = document.querySelector( 'tp-modal' );
modal.open();
```

```html
<tp-modal overlay-click-close="yes" role="dialog" aria-labelledby="modal-title" aria-modal="true">
	<tp-modal-close>
		<button autofocus aria-label="Close modal">Close</button>
	</tp-modal-close>
	<tp-modal-content>
		<h2 id="modal-title">Modal Title</h2>
		<p>Any modal content here.</p>
	</tp-modal-content>
</tp-modal>
```

## Attributes

| Attribute           | Required | Values     | Notes                                                                 |
|---------------------|----------|------------|-----------------------------------------------------------------------|
| overlay-click-close | No       | `yes`      | Closes the modal when the overlay is clicked                          |
| focus-trap          | No       | `yes`/`no` | Traps focus within the modal. Defaults to `yes`. Set `no` to disable  |
| manage-focus        | No       | `yes`/`no` | Sets initial focus on open and restores on close. Defaults to `yes`   |

## Events

| Event        | Notes                                  |
|--------------|----------------------------------------|
| before-open  | Immediately before the modal is opened |
| open         | When the modal is opened               |
| close        | When the modal is closed               |
| before-close | Immediately before the modal is closed |

## Methods

### `open`

Open the modal.

### `close`

Close the modal.

## Accessibility

The modal component provides the mechanical accessibility features, while you control the semantic markup.

### What the Component Handles

- **Focus trap** — Focus is trapped within the modal using `inert` on sibling elements, with a Tab loop fallback for older browsers.
- **Escape to close** — Pressing Escape closes the modal.
- **Focus management** — Focus is saved before opening and restored after closing.
- **Initial focus** — On open, focuses the element with `autofocus` attribute, or the modal container if none exists.
- **Background isolation** — Sets `inert` and `aria-hidden="true"` on all sibling elements to block interaction and hide from assistive technology.

### What You Must Provide

| Attribute | Purpose |
|-----------|---------|
| `role="dialog"` | Identifies the modal as a dialog. Use `role="alertdialog"` for confirmations. |
| `aria-labelledby="id"` | Points to the modal's heading for screen reader announcement. |
| `aria-modal="true"` | Indicates the modal blocks interaction with the rest of the page. |
| `aria-describedby="id"` | Optional. Points to descriptive content if needed. |
| `aria-label` | On the close button if it only contains an icon. |

### Focus Behavior

Use the `autofocus` attribute on any element inside the modal to control where focus goes when the modal opens:

```html
<!-- Focus goes to the close button -->
<tp-modal-close>
	<button autofocus>Close</button>
</tp-modal-close>

<!-- Or focus a specific input -->
<tp-modal-content>
	<input type="text" autofocus>
</tp-modal-content>
```

If no `autofocus` element exists, focus goes to the modal container itself (which has `tabindex="-1"`).
