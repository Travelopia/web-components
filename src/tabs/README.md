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
import { TPTabs } from '@travelopia/web-components';

...

const tabs: TPTabs = document.querySelector( 'tp-tabs' );
tabs.setCurrentTab( 'overview' );
```

```html
<tp-tabs current-tab="tab-1" update-url="yes"> <-- ID without the hash
	<tp-tabs-nav>
		<tp-tabs-nav-item active="yes">
			<a href="#tab-1">Tab 1</a> <-- This component requires a link
		</tp-tabs-nav-item>
		<tp-tabs-nav-item>
			<a href="#tab-2">Tab 2</a>
		</tp-tabs-nav-item>
		<tp-tabs-nav-item>
			<a href="#tab-3">Tab 3</a>
		</tp-tabs-nav-item>
		<tp-tabs-nav-item>
			<a href="#tab-4">Tab 4</a>
		</tp-tabs-nav-item>
	</tp-tabs-nav>
	<tp-tabs-tab id="tab-1" open="yes">
		<p>Tab 1: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
	</tp-tabs-tab>
	<tp-tabs-tab id="tab-2">
		<p>Tab 2: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
	</tp-tabs-tab>
	<tp-tabs-tab id="tab-3">
		<p>Tab 3: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
	</tp-tabs-tab>
	<tp-tabs-tab id="tab-4">
		<p>Tab 4: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
	</tp-tabs-tab>
</tp-tabs>
```

## Attributes

| Attribute   | Required | Values                  | Notes                                               |
|-------------|----------|-------------------------|-----------------------------------------------------|
| current-tab | Yes      | (id of the current tab) | This attribute controls which tab is currently open |
| update-url  | No       | `yes`                    | Whether or not to update the has in the URL         |

## Events

| Event  | Notes                  |
|--------|------------------------|
| change | When a tab has changed |

## Methods

### `setCurrentTab`

Move to the tab with the given id.
