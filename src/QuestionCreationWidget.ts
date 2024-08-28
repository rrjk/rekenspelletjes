/* eslint-disable max-classes-per-file */
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

type StringFieldEnum = 'question' | 'correctAnswer';
type StringArrayFieldEnum = 'alternativeAnswers';

@customElement('question-creation-widget')
export class QuestionCreationWidget extends LitElement {
  @property()
  question = 'blaat';

  @state()
  correctAnswer = '';

  @state()
  alternativeAnswers: string[] = [];

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        grid-template-columns: 10rem 40rem;
        grid-template-rows: repeat(4, 20px);
        background-color: #cccccc;
        border: 1px;
      }
    `;
  }

  handleInputChangeUpdate(
    evt: Event,
    fieldName: StringFieldEnum | StringArrayFieldEnum,
    arrayIndex = 0
  ) {
    const elm = <HTMLInputElement>evt.target;
    if (elm !== null && fieldName !== undefined) {
      if (fieldName === 'question' || fieldName === 'correctAnswer')
        this[fieldName] = elm.value;
      else this[fieldName][arrayIndex] = elm.value;
    }
  }

  updatePropertyFromInput(
    elm: HTMLInputElement | null,
    toUpdate: StringFieldEnum
  ) {
    if (elm !== null && toUpdate !== undefined) {
      this[toUpdate] = elm.value;
    }
  }

  updatePropertyElementFromInput(
    elm: HTMLInputElement | null,
    toUpdate: StringArrayFieldEnum,
    index: number
  ) {
    if (elm != null && toUpdate !== undefined && index !== undefined) {
      this[toUpdate][index] = elm.value;
    }
    console.log(this.alternativeAnswers);
  }

  render(): HTMLTemplateResult {
    return html`
      <div><b>Vraag</b></div>
      <div>
        <input
          type="text"
          label="vraag"
          maxlength="80"
          size="40"
          .value=${this.question}
          @change=${(evt: Event) =>
            this.updatePropertyFromInput(
              <HTMLInputElement>evt.target,
              'question'
            )}
        />
      </div>
      <div><b>Juiste antwoord</b></div>
      <div>
        <input
          type="text"
          label="juiste antwoord"
          maxlength="80"
          size="40"
          .value=${this.question}
          @change=${(evt: Event) =>
            this.updatePropertyFromInput(
              <HTMLInputElement>evt.target,
              'correctAnswer'
            )}
        />
      </div>
    `;
  }
}
