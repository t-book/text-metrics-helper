/**
 * TextMetricsHelper
 *
 * This class helps developers calculate:
 * - the minimal possible line-height (without cutting off ascenders/descenders)
 * - the exact pixel height required for a given number of lines
 * - the browser's current effective line-height for an element
 *
 * It uses CanvasRenderingContext2D.measureText() with
 * actualBoundingBoxAscent / actualBoundingBoxDescent, which
 * is widely supported in modern browsers.
 */
class TextMetricsHelper {
  /**
   * @param {HTMLElement} element - The element to measure.
   * @param {string} referenceText - A string that contains tall ascenders and deep descenders.
   *                                 Default "ÄyG|?" covers most Latin scripts.
   */
  constructor(element, referenceText = "ÄyG|?") {
    if (!element) throw new Error("TextMetricsHelper: no element provided.");

    this.element = element;
    this.referenceText = referenceText;

    // Read computed font styles from the element
    const style = window.getComputedStyle(element);
    this.fontSize = parseFloat(style.fontSize);
    this.fontFamily = style.fontFamily;
    this.fontWeight = style.fontWeight;
    this.fontStyle = style.fontStyle;

    // Create an off-screen canvas for measuring text
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;

    // Measure the reference text and store the metrics
    this.metrics = this.ctx.measureText(this.referenceText);
  }

  /**
   * Returns the minimal line-height (relative to font-size)
   * required to render the reference text without clipping.
   * Example: 0.92 means "92% of font-size".
   */
  getMinLineHeight() {
    if (
      this.metrics.actualBoundingBoxAscent === undefined ||
      this.metrics.actualBoundingBoxDescent === undefined
    ) {
      console.warn(
        "actualBoundingBoxAscent/Descent not supported. Fallback = 1.0"
      );
      return 1;
    }

    // We divide total visual height by font-size to get a unitless line-height
    return (
      (this.metrics.actualBoundingBoxAscent +
        this.metrics.actualBoundingBoxDescent) /
      this.fontSize
    );
  }

  /**
   * Returns the element's current line-height (relative to font-size).
   * If line-height is "normal", we estimate a browser default.
   */
  getElementLineHeight() {
    const style = window.getComputedStyle(this.element);
    if (style.lineHeight === "normal") {
      return this.estimateNormalLineHeight();
    }
    return parseFloat(style.lineHeight) / this.fontSize;
  }

  /**
   * Estimates the browser's "normal" line-height.
   * We use ascent + descent (visual height) with a small safety factor (1.1)
   * to match what browsers typically choose.
   */
  estimateNormalLineHeight() {
    const ascent = this.metrics.actualBoundingBoxAscent;
    const descent = this.metrics.actualBoundingBoxDescent;
    const visual = ascent + descent;
    return (visual / this.fontSize) * 1.1;
  }

  /**
   * Returns the pixel height required for a given number of lines,
   * using a given line-height value.
   *
   * @param {number} lineCount - number of lines
   * @param {number} lineHeight - optional line-height (relative), defaults to element's current
   */
  getHeightForLines(lineCount = 1, lineHeight = this.getElementLineHeight()) {
    return lineHeight * this.fontSize * lineCount;
  }

  /**
   * Returns the pixel height required for a given number of lines,
   * using the minimal possible line-height (no clipping).
   */
  getMinHeightForLines(lineCount = 1) {
    const minLH = this.getMinLineHeight();
    return this.getHeightForLines(lineCount, minLH);
  }

  /**
   * Returns an object with all relevant metrics:
   * - fontSize
   * - ascent, descent (in px)
   * - minLineHeight (relative)
   * - currentLineHeight (relative)
   */
  getMetrics() {
    return {
      fontSize: this.fontSize,
      ascent: this.metrics.actualBoundingBoxAscent,
      descent: this.metrics.actualBoundingBoxDescent,
      minLineHeight: this.getMinLineHeight(),
      currentLineHeight: this.getElementLineHeight(),
    };
  }
}