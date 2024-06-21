/* eslint-disable max-classes-per-file */
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

@customElement('question-creation-widget')
export class QuestionCreationWidget extends LitElement {
  @state()
  question = '';

  @state()
  correctAnswer = '';

  @state()
  alternativeAnswers: string[] = [];

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: inline-block;
        background-color: #cccccc;
        border-radius: 10%;
        border: 0px;
      }
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <input type="text" id="question" name="Vraag" maxlength="80" />
    `;
  }
}
