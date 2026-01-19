# Lightbox

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

This is a super minimal lightbox that uses the native `<dialog>` element and is designed to be highly extendable.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/lightbox';
import '@travelopia/web-components/dist/lightbox/style.css';

// TypeScript usage:
import { TPLightboxElement } from '@travelopia/web-components';

...

const lightbox: TPLightboxElement = document.querySelector( 'tp-lightbox' );
lightbox.open();
```

First, create the lightbox and give it an ID. Style as needed:

```html
<tp-lightbox id="my-lightbox" close-on-overlay-click="yes" swipe="yes" swipe-threshold="300" arrow-navigation="yes">
	<dialog role="dialog" aria-label="Image gallery">
		<tp-lightbox-close>
			<button autofocus aria-label="Close lightbox">Close</button>
		</tp-lightbox-close>
		<tp-lightbox-previous>
			<button aria-label="Previous image">Previous</button>
		</tp-lightbox-previous>
		<tp-lightbox-next>
			<button aria-label="Next image">Next</button>
		</tp-lightbox-next>
		<tp-lightbox-content></tp-lightbox-content>
		<tp-lightbox-count format="$current / $total" aria-live="polite" aria-atomic="true"></tp-lightbox-count>
	</dialog>
</tp-lightbox>
```

Next, we need to trigger the lightbox and give it some content. Any content added inside the `template` will be added to the lightbox, so you have full control over it:

```html
<tp-lightbox-trigger lightbox="my-lightbox" group="group-1">
	<button>Open Lightbox</button>
	<template>
		<img src="https://picsum.photos/id/65/600/300" width="600" height="300" alt="Laptop on a wooden desk">
	</template>
</tp-lightbox-trigger>
```

## Attributes

| Attribute              | Required | Values     | Notes                                                                  |
|------------------------|----------|------------|------------------------------------------------------------------------|
| close-on-overlay-click | No       | `yes`      | Closes the lightbox when the overlay is clicked                        |
| swipe                  | No       | `yes`      | Enables swiping on touch devices                                       |
| swipe-threshold        | No       | `200`      | Prevent swiping if more than this distance is swiped                   |
| arrow-navigation       | No       | `yes`/`no` | Enables left/right arrow key navigation. Defaults to `no`              |
| manage-focus           | No       | `yes`/`no` | Sets initial focus on open and restores on close. Defaults to `yes`    |
| aria                   | No       | `yes`/`no` | Component manages ARIA attributes. Defaults to `yes`. Set `no` to disable |

## Events

| Event          | Notes                                                       |
|----------------|-------------------------------------------------------------|
| change         | When any attribute has changed                              |
| template-set   | When a template is set, before content has actually updated |
| content-change | When the content has updated inside the lightbox            |
| slide-set      | When a slide in the lightbox is set                         |

## Methods

### `open`

Open the lightbox.

### `close`

Close the lightbox.

### `previous`

Navigate to the previous slide.

### `next`

Navigate to the next slide.

## Accessibility

The lightbox component uses the native `<dialog>` element with `showModal()`, providing built-in accessibility features. You control the semantic markup.

### What the Component Handles

- **Focus trap** — Native `<dialog>` traps focus within the lightbox.
- **Escape to close** — Native `<dialog>` closes on Escape key.
- **Focus management** — Focus is saved before opening and restored after closing.
- **Initial focus** — On open, focuses the element with `autofocus` attribute, or the dialog if none exists.
- **Arrow navigation** — Left/Right arrow keys navigate slides (when `arrow-navigation="yes"`).
- **ARIA on nav items** — Sets `aria-current="true"` on the current nav button.
- **ARIA on prev/next** — Sets `aria-disabled="true"` on buttons when disabled.

### What You Must Provide

| Attribute | Purpose |
|-----------|---------|
| `role="dialog"` | On the `<dialog>` element. Identifies it as a dialog. |
| `aria-label` | On the `<dialog>` to describe the lightbox content (e.g., "Image gallery"). |
| `aria-label` | On close, previous, and next buttons to describe their action. |
| `alt` | On images to provide meaningful descriptions. |
| `aria-live="polite"` | On `tp-lightbox-count` to announce slide changes to screen readers. |
| `aria-atomic="true"` | On `tp-lightbox-count` to announce the full count on each change. |

### Focus Behavior

Use the `autofocus` attribute on any element inside the lightbox to control where focus goes when it opens:

```html
<!-- Focus goes to the close button -->
<tp-lightbox-close>
	<button autofocus aria-label="Close lightbox">Close</button>
</tp-lightbox-close>
```

If no `autofocus` element exists, focus goes to the dialog itself.
