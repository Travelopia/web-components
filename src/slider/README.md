# Slider

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

This is a highly customizable slider component. Pick and choose subcomponents to use, and style as needed!

Example:

```js
// Import the component as needed:
import '@travelopia/web-components/dist/slider';
import '@travelopia/web-components/dist/slider/style.css';

// TypeScript usage:
import { TPSliderElement } from '@travelopia/web-components';

...

const slider: TPSliderElement = document.querySelector( 'tp-slider' );
slider.setCurrentSlide( 2 );
```

```html
<tp-slider flexible-height="yes" infinite="yes" swipe="yes">
	<tp-slider-arrow direction="previous"><button>&laquo; Previous</button></tp-slider-arrow> <-- There must be a button inside this component
	<tp-slider-arrow direction="next"><button>Next &raquo;</button></tp-slider-arrow> <-- There must be a button inside this component
	<tp-slider-track>
		<tp-slider-slides>
			<tp-slider-slide><img src="image.jpg" width="600" height="300" alt=""></tp-slider-slide>
			<tp-slider-slide>
				<p>Any content you want here.</p>
			</tp-slider-slide>
		</tp-slider-slides>
	</tp-slider-track>
	<tp-slider-nav>
		<tp-slider-nav-item><button>1</button></tp-slider-nav-item> <-- There must be a button inside this component
		<tp-slider-nav-item><button>2</button></tp-slider-nav-item> <-- There must be a button inside this component
	</tp-slider-nav>
	<tp-slider-count current="1" total="2" format="$current / $total">1 / 2</tp-slider-count>
</tp-slider>
```

## Attributes

| Attribute           | Required | Values                | Notes                                                                                                           |
|---------------------|----------|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| flexible-height     | No       | `yes`                 | Whether the height of the slider changes depending on the content inside the slides                             |
| infinite            | No       | `yes`                 | Go back to the first slide at the end of all slides, and open the last slide when navigating backwards          |
| swipe               | No       | `yes`                 | Whether to add support for swiping gestures on touch devices                                                    |
| behaviour           | No       | `fade`, `slide`       | The default behaviour is to slide between slides. This can be updated to fade.                                  |
| auto-slide-interval | No       | <interval>            | Interval in milliseconds.                                                                                       |
| per-view            | No       | <per-view>            | Handles slider behavior having more than 1 slides. No. of slides to show in one view. Default value is 1.       |
| step                | No       | <step>                | Steps number of slides on next and previous transition. No. of slides to step to at a time. Default value is 1. |
| swipe-threshold     | No       | `200`                 | It will not swipe if the swipe value is more than this number. Default value is 200.                            |
| min-swipe-threshold     | No       | `0`                 | The minimum swipe distance required for a swipe to register. Works with swipe-threshold to define the valid swipe range. Default value is 0. |
| responsive          | No       | <responsive-settings> | Responsive settings to be passed in a JSON string format.                                                       |
| aria                | No       | `yes`/`no`            | Manages `aria-hidden` on non-visible slides. Defaults to `yes`. Set `no` to disable.                            |
| arrow-navigation    | No       | `yes`                 | Enables Left/Right arrow key navigation. Disabled by default.                                                   |

* `responsive` attribute value data shape.
- When passing the settings, JSON stringy it before passing it to responsive attribute.
- If you pass the responsive attribute, then it will take precedence over any the directly passed attributes values at the given breakpoints.
Be sure to pass the default attributes outside the responsive attribute too, this is because there are CSS attached to those attributes and it may cause CLS
issue if the default attributes ( e.g. flexible-height, infinite etc are not passed )

```javascript
[
    {
        'media'              : '(min-width: 600px)',
        'flexible-height'    : 'yes',
        'infinite'           : 'yes',
        'swipe'              : 'yes',
        'behaviour'          : 'fade',
        'auto-slide-interval': 3000,
        'per-view'           : 2,
        'step'               : 2,
    },
    {
        'media'              : '(min-width: 300px)',
        'flexible-height'    : 'no',
        'infinite'           : 'no',
        'swipe'              : 'yes',
        'behaviour'          : 'slide',
        'auto-slide-interval': 2000,
        'per-view'           : 1,
        'step'               : 1,
    },
]
```

## Events

| Event               | Notes                                            |
|---------------------|--------------------------------------------------|
| slide-set           | When the current slide is set, but before sliding |
| slide-complete      | After sliding is complete                        |
| auto-slide-complete | After auto sliding is complete                   |

## Methods

### `next`

Navigate to the next slide.

### `previous`

Navigate to the previous slide.

### `getCurrentSlide`

Gets the current slide's index.

### `setCurrentSlide`

Sets the current slide based on its index.

## Accessibility

The slider component provides mechanical accessibility features while you control the semantic markup.

### What the Component Handles

- **`aria-hidden` on non-visible slides** — Slides outside the current view get `aria-hidden="true"` so screen readers only announce visible content. Controlled by the `aria` attribute (enabled by default).
- **Arrow key navigation** — Left/Right arrow keys navigate between slides. Disabled by default, enable with `arrow-navigation="yes"`.

### What You Should Provide

| Attribute | Purpose |
|-----------|---------|
| `role="region"` | Identifies the slider as a landmark (optional) |
| `aria-label` | Describes the slider, e.g., "Product gallery" |
| `aria-roledescription="carousel"` | Optional, helps screen readers understand the pattern |
| `alt` on images | Meaningful descriptions for slide images |

### Example with Accessibility

```html
<tp-slider role="region" aria-label="Product gallery" flexible-height="yes" infinite="yes" swipe="yes">
	<tp-slider-arrow direction="previous"><button aria-label="Previous slide">&laquo;</button></tp-slider-arrow>
	<tp-slider-arrow direction="next"><button aria-label="Next slide">&raquo;</button></tp-slider-arrow>
	<tp-slider-track>
		<tp-slider-slides>
			<tp-slider-slide><img src="product-1.jpg" alt="Red sneakers, side view"></tp-slider-slide>
			<tp-slider-slide><img src="product-2.jpg" alt="Red sneakers, top view"></tp-slider-slide>
		</tp-slider-slides>
	</tp-slider-track>
</tp-slider>
```

### Announcing Slide Changes (Live Regions)

The component does not automatically announce slide changes — you control what gets announced and when. To announce slide changes, add `aria-live` to the counter:

```html
<tp-slider-count aria-live="polite" aria-atomic="true" format="Slide $current of $total">
	Slide 1 of 4
</tp-slider-count>
```

- `aria-live="polite"` — announces changes when the user is idle
- `aria-atomic="true"` — announces the entire content, not just the changed part

The counter updates automatically when slides change, and the live region will announce the new text.
