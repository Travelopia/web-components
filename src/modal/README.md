# Modal

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

This is a super minimal modal that is designed to be highly extendable.

Example:

```html
<tp-modal overlay-click-close="yes">
	<tp-modal-close>
		<button>Close</button> <-- There must be a button inside inside this component.
	</tp-modal-close>
	<tp-modal-content>
		<p>Any modal content here.</p>
	</tp-modal-content>
</tp-modal>
```

## Attributes

| Attribute            | Required | Values | Notes                                        |
|----------------------|----------|--------|----------------------------------------------|
| overlay-click-close  | No       | `yes`  | Closes the modal when the overlay is clicked |
