# text-metrics-helper

A small JavaScript utility for measuring **exact text metrics** in the browser:

- Get the **minimal line-height** that won’t clip ascenders/descenders.
- Get the browser’s **current effective line-height** (even when `line-height: normal`).
- Compute **exact container heights** for a given number of lines.
- Works in all modern browsers (Chrome, Firefox, Safari, Edge).


## Why This Exists

CSS does not expose actual ascender/descender metrics.
If you want pixel-perfect text layouts — for example in a canvas editor or when syncing line-height between web and design tools — this library helps you compute them correctly.

---

## Usage

```html
<div class="my-div" style="font-size: 48px;">Äy<br>hÄalloy</div>
<script type="module">
  import { TextMetricsHelper } from "text-metrics-helper";

  const el = document.querySelector(".my-div");
  const helper = new TextMetricsHelper(el);

  // 1. Get minimal line-height (relative value)
  console.log("Minimal line-height:", helper.getMinLineHeight());

  // 2. Calculate height for 2 lines with minimal line-height
  console.log("Min height for 2 lines:", helper.getMinHeightForLines(2));

  // 3. Get browser's current effective line-height (even if 'normal')
  console.log("Current line-height:", helper.getElementLineHeight());

  // 4. Get current height for 3 lines
  console.log("Height for 3 lines:", helper.getHeightForLines(3));
</script>

```

##  API

`new TextMetricsHelper(element, referenceText?)`

Creates a helper for the given element.
Optionally pass a referenceText that includes characters with ascenders/descenders (defaults to "ÄyG|?").

`getMinLineHeight()`

Returns the minimal line-height (unitless) that fully fits the reference text without clipping.

`getElementLineHeight()`

Returns the current line-height (unitless) as used by the browser.
If line-height: normal is set, an estimated default value is returned.

`getHeightForLines(lineCount, lineHeight?)`

Returns the pixel height for a given number of lines using either:
- a custom lineHeight (unitless)
- or the element's current line-height if none is provided.

`getMinHeightForLines(lineCount)`

Returns the pixel height for a given number of lines using the minimal line-height.

`getMetrics()`

Returns an object containing:
- fontSize (px)
- ascent, descent (px)
- minLineHeight (unitless)
- currentLineHeight (unitless)