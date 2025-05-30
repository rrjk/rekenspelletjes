import { LitElement } from 'lit';

export interface ResizeObserverClientInterface extends LitElement {
  handleResize(resizeInfo: DOMRectReadOnly): void;
}

const ro = new ResizeObserver(entries => {
  entries.forEach(entry =>
    (entry.target as ResizeObserverClientInterface).handleResize(
      entry.contentRect,
    ),
  );
});

export function addResizeObserverClient(
  client: ResizeObserverClientInterface,
): void {
  ro.observe(client);
}

export function removeResizeObserverClient(
  client: ResizeObserverClientInterface,
): void {
  ro.unobserve(client);
}
