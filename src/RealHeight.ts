let _realViewportHeight = 0;
let _realViewportWidth = 0;

export function getRealViewportHeight(): number {
  return _realViewportHeight;
}

export function getRealViewportWidth(): number {
  return _realViewportWidth;
}

function updateViewPortDimensions() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  // _realViewportHeight = window.innerHeight;
  // _realViewportWidth = window.innerWidth;
  _realViewportHeight = document.querySelector('html')?.clientHeight ?? 1;
  _realViewportWidth = document.querySelector('html')?.clientWidth ?? 1;
  const vh = _realViewportHeight * 0.01;
  const vw = _realViewportWidth * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vhWithoutUnit', `${vh}`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);
  document.documentElement.style.setProperty('--vwWithoutUnit', `${vw}`);
}

updateViewPortDimensions();

// We listen to the resize event to ensure that upon a resize of the browser window, or an orientation change on mobile, --vh and --vw are  properly updated.
window.addEventListener('resize', () => {
  updateViewPortDimensions();
});
