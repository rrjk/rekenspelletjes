import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';
import type { MessageDialogV2 } from './MessageDialogV2';
import './MessageDialogV2';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor dialogOpen = false;

  dialogRef: Ref<MessageDialogV2> = createRef();

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
        }
        div#im {
          height: 100px;
          width: 100px;
          background-color: green;
        }
        img {
          object-fit: contain;
          max-width: 100px;
          max-height: 100px;
        }
      `,
    ];
  }
  protected renderTest(): HTMLTemplateResult {
    return html` <button @click=${() => this.handleButtonClick()}>
        AppButton
      </button>
      <div id="im">
        <img src=${new URL('../images/Mompitz Otto.png', import.meta.url)} />
      </div>
      <p>Test</p>
      <message-dialog-v2
        ${ref(this.dialogRef)}
        @close=${() => this.handleOk()}
        .imageUrl=${new URL('../images/Mompitz Otto.png', import.meta.url)}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis
          ultrices nisi, convallis gravida massa. Quisque a turpis eget lectus
          commodo ullamcorper et in justo. Curabitur nisl felis, pharetra vitae
          accumsan id, porttitor sit amet magna. Aenean pretium placerat
          tincidunt. Duis sit amet sodales dui, condimentum commodo tortor.
          Fusce a orci id nunc lobortis tincidunt. Aenean feugiat facilisis sem,
          in vestibulum justo rutrum blandit. Maecenas eu suscipit enim, et
          commodo velit. Praesent arcu tellus, lacinia vel eros ac, sodales
          laoreet justo.
        </p>

        <p>
          Suspendisse potenti. Integer sollicitudin sed est sed lacinia. Mauris
          consectetur ligula erat, vel efficitur ex vulputate vel. Sed quis
          lacus nibh. Nulla dapibus sem eget luctus dapibus. Vestibulum
          facilisis rhoncus justo nec dictum. Praesent faucibus diam eget turpis
          facilisis, in sollicitudin tellus porta. Maecenas eros lorem,
          fringilla ut magna et, mollis tempus felis. Cras hendrerit rutrum
          arcu, vitae rhoncus est lobortis facilisis. Nulla placerat quam
          libero. In lacinia a neque at lacinia. In odio dolor, ornare et orci
          at, dignissim eleifend lorem. Phasellus eget vestibulum turpis. Nulla
          est orci, posuere placerat varius quis, hendrerit vitae eros. Cras
          consectetur urna rhoncus viverra varius. Maecenas eleifend quam ex, et
          tempus dui ullamcorper a.
        </p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Sed fringilla sapien ut lorem finibus mollis.</p>
      </message-dialog-v2>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }

  handleButtonClick() {
    console.log(`App Button click`);
    if (this.dialogRef.value) this.dialogRef.value.showModal();
    this.dialogOpen = true;
  }

  handleOk() {
    console.log(`Ok button clicked`);
    this.dialogOpen = false;
  }
}
