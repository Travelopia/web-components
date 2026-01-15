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

This is a highly customizable tooltip component.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/tooltip';
import '@travelopia/web-components/dist/tooltip/style.css';

// No JavaScript is required to initialise!
```

```html
<tp-tooltip id="did-you-know"> <-- Define and style the tooltip, and give it an ID
	<tp-tooltip-content>
		<slot></slot> <-- This is where the content of the tooltip would go
	</tp-tooltip-content>
	<tp-tooltip-arrow></tp-tooltip-arrow> <-- If you want an arrow
</tp-tooltip>

<p>
	Here is some informative content about

	<tp-tooltip-trigger tooltip="did-you-know"> <-- Make any element a tooltip trigger by wrapping this component
		<template> <-- Define and style your tooltip's content as needed. Everything inside this will go into the `slot` above
			<p>
				<img src="">
				More information about interesting subject.
			</p>
		</template>
		<a href="#">interesting subject</a> <-- The first direct descendant (that is not a template) is the trigger
	</tp-tooltip-trigger>

	that you may be interested in!
</p>
```

## Attributes

| Attribute           | Required | Values   | Notes                                                                                                           |
|---------------------|----------|----------|-----------------------------------------------------------------------------------------------------------------|
| offset              | No       | <number> | The offset in pixels from the trigger that the tooltip should display                                           |

## Events

| Event | Notes                         |
|-------|-------------------------------|
| show  | After the tooltip is visible  |
| hide  | After the tooltip is hidden   |
