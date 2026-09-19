import {
  css,
  CSSResultArray,
  html,
  HTMLTemplateResult,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type Entry } from './SectionInfoType';
import { convertJSON } from '../Utils';
import {
  getIconRenderFunction,
  iconRenderFunctionSupported,
} from '../IconFunctionsPerGameCode';
import { renderEditIcon, renderTranscanIcon } from '../Icons';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import {
  GameInfo,
  gameInfoToShortUrl,
  shortUrlToGameInfo,
  urlToGameInfo,
} from '../URLshortener2';
import { classMap } from 'lit/directives/class-map.js';
import { UnexpectedValueError } from '../UnexpectedValueError';
import { hourGlassIcons, TimeCode } from '../TimeCodes';

/** Enumeration for validation issues for the URL */
type ValidationIssue = 'noIssues' | 'invalidLink' | 'gameNotSupported';

/** Editable game icon card
 * @fires game-changed - Fired when the game or time is changed.
 * @fires icon-deleted - Fired when the icon is deleted.
 */
@customElement('editable-game-icon')
export class EditableGameIconCard extends LitElement {
  /** GameInfo for the icon */
  @property({ type: Object, converter: convertJSON<Entry> })
  accessor gameInfo: Entry = { game: 'A', variant: 'aa', timeCode: 'a' };

  /** State variable to keep track of whether an edit is in progress */
  @state()
  accessor editInProgress = false;

  /** State variable for the draft url
   * Upon completion, the draft value is used to determine the new game information.
   */
  @state()
  accessor draftUrl = '';

  /** State variable for validation issues */
  @state()
  accessor validationIssue: ValidationIssue = 'noIssues';

  /** Reference to the input element in edit mode */
  inputRef: Ref<HTMLInputElement> = createRef();

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: ${180 / 120};
          display: grid;
          row-gap: 2px;
          justify-items: center;
          grid-template-columns: repeat(5, 20%);
          grid-template-rows: ${(20 / 120) * 100}% ${(100 / 120) * 100}%;
          grid-template-areas:
            'edit delete 1min 3min 5min'
            'icon icon icon icon icon';
        }

        div#icon {
          grid-area: icon;
          height: 100%;
          width: 100%;
        }

        div#editBox {
          height: 100%;
          width: 100%;
          padding: 3%;
          border: 2px solid black;
          border-radius: 10px;
          box-sizing: border-box;
        }

        button {
          aspect-ratio: 1;
          height: 100%;
          padding: 0;
        }

        button#delete {
          grid-area: delete;
        }

        button#edit {
          grid-area: edit;
        }

        button#timeA {
          grid-area: 1min;
        }

        button#timeB {
          grid-area: 3min;
        }

        button#timeC {
          grid-area: 5min;
        }

        input {
          width: 95%;
          font-size: var(--font-size, 1em);
          font-weight: var(--font-weight, normal);
          margin-top: 2%;
          margin-bottom: 2%;
        }

        input.invalid {
          border: red 1px solid;
        }

        div.validationMessage {
          color: red;
          font-size: 0.7em;
        }

        div.helpMessage {
          font-size: 0.7em;
        }

        img {
          max-width: 100%;
          max-height: 100%;
        }
      `,
    ];
  }

  validationFail(isse: ValidationIssue) {
    this.validationIssue = isse;
    this.inputRef.value?.focus();
    this.inputRef.value?.select();
  }

  onClickDelete() {
    this.dispatchEvent(new Event('icon-deleted'));
  }

  onClickEdit() {
    this.editInProgress = true;
    this.draftUrl = gameInfoToShortUrl(this.gameInfo).href;
    this.validationIssue = 'noIssues';
  }

  onInput(e: InputEvent) {
    if (e.target instanceof HTMLInputElement) {
      this.draftUrl = e.target.value;
    }
  }

  onBlur() {
    if (this.draftUrl === gameInfoToShortUrl(this.gameInfo).href) {
      this.editInProgress = false;
      return;
    }

    const url = URL.parse(this.draftUrl);
    const gameInfo = url && (shortUrlToGameInfo(url) || urlToGameInfo(url));

    if (!url) {
      this.validationFail('invalidLink');
      return;
    }

    if (!gameInfo) {
      this.validationFail('invalidLink');
      return;
    }

    if (!iconRenderFunctionSupported(gameInfo.game)) {
      this.validationFail('gameNotSupported');
      return;
    }

    this.dispatchEvent(
      new CustomEvent<GameInfo>('game-changed', { detail: gameInfo }),
    );
    this.editInProgress = false;
  }

  onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement) {
      if (e.key === 'Enter') {
        e.target.blur(); // triggers onCommitValue via @blur
      } else if (e.key === 'Escape') {
        this.editInProgress = false;
      }
    }
  }

  onTimeChange(newTime: TimeCode) {
    const newGameInfo: GameInfo = {
      ...this.gameInfo,
      timeCode: newTime,
    };
    this.dispatchEvent(
      new CustomEvent<GameInfo>('game-changed', { detail: newGameInfo }),
    );
  }

  updated(changeProperties: PropertyValues<this>) {
    if (
      changeProperties.has('editInProgress') &&
      this.editInProgress === true
    ) {
      this.inputRef.value?.focus();
      this.inputRef.value?.select();
    }
  }

  renderEditBox(): HTMLTemplateResult {
    const classes = { invalid: this.validationIssue !== 'noIssues' };
    let validationMessage: HTMLTemplateResult | typeof nothing = nothing;
    switch (this.validationIssue) {
      case 'noIssues':
        validationMessage = nothing;
        break;
      case 'gameNotSupported':
        validationMessage = html` <div class="validationMessage">
          Dit spel wordt nog niet ondersteund voor doelenkaarten.
        </div>`;
        break;
      case 'invalidLink':
        validationMessage = html` <div class="validationMessage">
          De link is geen geldige spellink.
        </div>`;
        break;
      default:
        throw new UnexpectedValueError(this.validationIssue);
    }
    return html`
      <div id="editBox">
        <span>Plak de spel link</span>
        <input
          class="${classMap(classes)};"
          ${ref(this.inputRef)}
          .value=${this.draftUrl}
          @input=${(e: InputEvent) => this.onInput(e)}
          @blur=${() => this.onBlur()}
          @keydown=${(e: KeyboardEvent) => this.onKeydown(e)}
        />
        ${validationMessage}
        <div class="helpMessage">Annuleer met Esc</div>
      </div>
    `;
  }

  render() {
    const iconRenderFunction = getIconRenderFunction(this.gameInfo.game);
    let iconArea: HTMLTemplateResult | typeof nothing = nothing;

    if (this.editInProgress) {
      iconArea = this.renderEditBox();
    } else {
      iconArea = iconRenderFunction(
        this.gameInfo.variant,
        {},
        this.gameInfo.timeCode,
      );
    }
    return html` <button id="delete" @click=${() => this.onClickDelete()}>
        ${renderTranscanIcon()}
      </button>
      <button id="edit" @click=${() => this.onClickEdit()}>
        ${renderEditIcon()}
      </button>
      <button id="timeA" @click=${() => this.onTimeChange('a')}>
        <img src=${hourGlassIcons.a.href} />
      </button>
      <button id="timeB" @click=${() => this.onTimeChange('b')}>
        <img src=${hourGlassIcons.b.href} />
      </button>
      <button id="timeC" @click=${() => this.onTimeChange('c')}>
        <img src=${hourGlassIcons.c.href} />
      </button>
      <div id="icon">${iconArea}</div>`;
  }
}
