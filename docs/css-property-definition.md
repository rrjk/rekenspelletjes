# Define CSS custom properties in lit custom elements.

Browsers do not allow defining CSS custom properties using @property in a shadow dom, even though according to the standards, it should be possible. Such definition are simply silently ignored.

Such properties need to defined at the document level, this can be done by adding a static block to the LitElement based class as shown below.

Please note that this defined the propery at a global level, hence it's wise to prefix with the customer element name.

In many cases it's probably easier to simply use customer variarables without a propety definition.

For more info, see https://claude.ai/chat/4bb77044-a73d-4c93-a783-cb0f0af50eca and https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property

```
/** Define CSS custom properties
 * CSS Customer properties cannot be defined inside the shadow root (consistent error in all browsers).
*/
static {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    @property --<custom-element-name>-line-color{
      syntax: '<color>';
      inherits: true;
      initial-value: black;
    }`);
  document.adoptedStyleSheets.push(sheet);
}
```
