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

This is a super minimal modal that is designed to be highly extendable.

Example:

First, create the lightbox and give it an ID. Style as needed:

```html
<tp-lightbox id="my-lightbox" close-on-overlay-click="yes" swipe="yes" swipe-threshold="300">
	<dialog>
		<tp-lightbox-close>
			<button>Close</button> <-- There must be a button inside this component.
		</tp-lightbox-close>
		<tp-lightbox-previous>
			<button>Previous</button> <-- There must be a button inside this component.
		</tp-lightbox-previous>
		<tp-lightbox-next>
			<button>Next</button> <-- There must be a button inside this component.
		</tp-lightbox-next>
		<tp-lightbox-content></tp-lightbox-content>
		<tp-lightbox-count format="$current / $total"></tp-lightbox-count>
	</dialog>
</tp-lightbox>
```

Next, we need to trigger the lightbox with and give it some content. Any content added inside the `template` will be added to the lightbox, so you have full control over it:

```html
<tp-lightbox-trigger lightbox="my-lightbox" group="group-1"> <-- Group multiple lightboxes together with a unique name.
	<button>Open Lightbox</button> <-- There must be a button inside this component.
	<template> <-- There must be template inside this component.
		<img src="https://picsum.photos/id/65/600/300" width="600" height="300" alt="">
	</template>
</tp-lightbox-trigger>
```

## Attributes

| Attribute              | Required  | Values   | Notes                                        |
|------------------------|-----------|----------|----------------------------------------------|
| close-on-overlay-click | No        | `yes`    | Closes the modal when the overlay is clicked |
| swipe                  | No        | `yes`    | Enables swiping                              |
| swipe-threshold        | No        | `200`    | Prevent swiping if more than this is swiped  |

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
