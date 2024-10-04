# Toggle Attribute

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

This is a versatile component to turn an attribute on a target component on and off based on changes on a trigger. This is useful to hide or show things, or just change a state on a target.

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/toggle-attribute';
import '@travelopia/web-components/dist/toggle-attribute/style.css';
```

```html
<!-- Target based on an explicit value -->
<p>Nested radio inputs</p>
<tp-toggle-attribute trigger="input[type='radio']" value="Yes" target="#radio-target">
	<label>
		<input type="radio" name="test" value="Yes" />
		Yes
	</label>
	<label>
		<input type="radio" name="test" value="No" />
		No
	</label>
</tp-toggle-attribute>

<div id="radio-target">
	Radio Target
</div>

<p>Select with targeted value</p>

<!-- Select value -->
<tp-toggle-attribute target="#select-target" value="Yes">
	<select>
		<option value="">Select</option>
		<option value="Yes">Yes</option>
		<option value="No">No</option>
	</select>
</tp-toggle-attribute>

<div id="select-target">
	Select Target
</div>

<p>Select with variable value and multiple targets</p>

<!-- Select value -->
<tp-toggle-attribute target=".toggle-target-variable">
	<select>
		<option value="">Select</option>
		<option value="First">First</option>
		<option value="Second">Second</option>
		<option value="Third">Third</option>
		<option value="Fourth">Fourth</option>
		<option value="Fifth">Fifth</option>
		<option value="All">All</option>
	</select>
</tp-toggle-attribute>

<div class="toggle-target-variable" data-toggle-value="First,All">
	Toggled First
</div>
<div class="toggle-target-variable">
	<!-- omit the data-toggle-value attribute to toggle on with all non empty values. -->
	This will be toggled for all non empty values.
</div>
<div class="toggle-target-variable" data-toggle-value="Second,All">
	Toggled Second
</div>

<p>Button with click event</p>
<tp-toggle-attribute event="click" target=".button-target">
	<button>Toggle using class</button>
</tp-toggle-attribute>

<tp-toggle-attribute event="click" target="#button-target">
	<button>Toggle using ID</button>
</tp-toggle-attribute>

<div class="button-target">
	Button Target class
</div>

<div class="button-target">
	Button Target class
</div>

<div id="button-target">
	Button Target ID
</div>
```

## Attributes

| Attribute              | Required | Values                             | Notes                                                                                                                                   |
|------------------------|----------|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| target                 | Yes    | <selector or the target>           | This is required if group is not mentioned                                                                                              |
| attribute              | No       | <attribute key>                    | The attribute to toggle. Default: `toggled`                                                                                             |
| attribute-value        | No       | <attribute value>                  | The attribute value when its. Default: `yes`                                                                                            |
| values                  | No       | <comma separated values to match>                   | If this is specified, these comma separated values are matched with the value of the trigger. If they match, the target(s) is/are toggled. Same goes for having a `data-toggle-value` attribute on a target.                         |
| trigger                | No       | <selector of the trigger>          | If this is not specified, the direct child is treated as the trigger. If it is mentioned, it looks for this selector within the context |
| closest-ancestor       | No       | <selector of the closest ancestor> | Default: `body`. If this is specified, the target is searched for within this selector, not on `body`.                                  |

## Events

| Event       | Notes                                          |
|-------------|------------------------------------------------|
| triggered   | When the trigger is fired, before any toggling |
| toggled     | When the target is toggled                     |
| toggled-on  | When the target is toggled on                  |
| toggled-off | When the target is toggled off                 |
