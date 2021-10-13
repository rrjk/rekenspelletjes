import { css } from 'lit';

export const RKdialogStyles = css`
  web-dialog {
    --dialog-width: 500px;
    --dialog-max-width: calc(80 * 1vw);
    --dialog-max-height: calc(var(--vh, 1vh) * 80);
    --dialog-padding: min(20px, 4vmin);
    --dialog-border-radius: min(30px, 4vmin);
    font-size: min(1em, 5vmin);
  }

  h1 {
    margin: 0 0 0 0;
    font-size: 1.5em;
  }

  header {
    margin-bottom: 10px;
  }

  footer {
    margin-top: 10px;
  }

  article {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }

  p {
    flex-grow: 1;
  }

  button {
    font-size: 1em;
  }
`; // By default a button has a font-size that is not equal to 1em, but some fixed number. As I need it to be responsive, I set it to 1em.
