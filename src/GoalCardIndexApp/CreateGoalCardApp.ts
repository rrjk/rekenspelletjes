import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

import {
  decodeGoalCardInfo,
  encodeGoalCardInfo,
  GoalCardInfo,
} from './SectionInfoType';

import './EditableGoalCardWidget';
import { renderEditIcon, renderPlusIcon, renderTranscanIcon } from '../Icons';
import { hourGlassIcons } from '../TimeCodes';
import { getColorInfo } from '../Colors';

const baseUrl = new URL('./Rekenspelletjes/', window.location.origin);

/** Enumeration for validation issues for the URL */
type ValidationIssue = 'noIssues' | 'invalidLink';

/** Application to create new goalcards
 * Has not attributes or events.
 */
@customElement('create-goalcard-app')
export class CreateGoalCardApp extends LitElement {
  get pageTitle(): string {
    return `Maak een doelenkaart`;
  }

  @state()
  accessor goalCardInfo: GoalCardInfo = {
    title: 'Titel voor de doelenkaart',
    sections: [
      {
        title: 'Blok titel',
        rows: [
          {
            entries: [
              {
                game: 'A',
                variant: 'a',
                timeCode: 'a',
              },
            ],
          },
        ],
      },
    ],
  };

  /** State variable for validation issues */
  @state()
  accessor validationIssue: ValidationIssue = 'noIssues';

  /** Reference to the input element for the base goal card */
  baseGoalCardInputRef: Ref<HTMLInputElement> = createRef();

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
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

        p {
          max-width: 900px;
        }

        span.icon {
          width: 1em;
          height: 1em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: -0.1em;
          border: 1px solid black;
          border-radius: 0.4em;
          background-color: ButtonFace;
        }

        span.textButton {
          height: 1em;
          display: inline-block;
          vertical-align: 0em;
          border: 1px solid black;
          border-radius: 0.4em;
          padding: 0.1em;
          background-color: ButtonFace;
          font-family: sans-serif;
          font-size: 0.8em;
        }

        span.icon img {
          max-width: 80%;
          max-height: 80%;
          object-fit: contain;
        }

        div.blockHeader,
        summary {
          display: flex;
          align-items: center;
          gap: 0.5em;
          list-style: none;
          font-size: 1.2em;
          font-weight: bold;
          background-color: ${unsafeCSS(
            getColorInfo('summaryBar').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('summaryBar').accentColorCode)};
          border-radius: 10px;
          padding: 5px;
          color: white;
        }

        summary {
          cursor: pointer;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        .arrow {
          transition: transform 0.2s;
        }

        details[open] summary .arrow {
          transform: rotate(90deg);
        }

        div.block,
        details {
          margin-bottom: 1em;
          border-radius: 10px;
          padding: 5px;
          background-color: ${unsafeCSS(
            getColorInfo('menuBackground').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('menuBackground').accentColorCode)};
        }
      `,
    ];
  }

  onGoalCardInfoChanged(updatedGoalCardInfo: GoalCardInfo) {
    this.goalCardInfo = updatedGoalCardInfo;
  }

  onGoalCardTitleChanged(updatedGoalCardTitle: string) {
    this.goalCardInfo = {
      title: updatedGoalCardTitle,
      sections: this.goalCardInfo.sections,
    };
  }

  handleUpdateBaseGoalcard() {
    this.validationIssue = 'invalidLink';
    const inputValue = this.baseGoalCardInputRef.value?.value;
    if (inputValue) {
      const newBaseGoalCardUrl = URL.parse(inputValue);
      if (newBaseGoalCardUrl) {
        const goalCardEncodedString = newBaseGoalCardUrl.searchParams.get('d');
        if (goalCardEncodedString) {
          try {
            const goalCardInfo = decodeGoalCardInfo(goalCardEncodedString);
            this.goalCardInfo = goalCardInfo;
            this.validationIssue = 'noIssues';
          } catch {
            // We don't need to do anything
          }
        }
      }
    }
  }

  renderExplanation(): HTMLTemplateResult {
    return html`
      <details>
        <summary><span class="arrow">▶</span> Uitleg</summary>
        <p>
          Op deze pagina kun je zelf een doelenkaart samenstellen met spelletjes
          van jufankie.nl.
        </p>
        <p>
          Een doelenkaart bestaat uit meerdere blokken, ieder met een eigen
          bloktitel en een aantal rijen met één of twee spelletjes. Nieuwe
          blokken kunnen gemaakt worden met de
          <span class="textButton">Nieuw blok</span> knop. Blokken kunnen
          weggegooid worden met
          <span class="icon">${renderTranscanIcon()}</span>. Als een blok wordt
          verwijderd, worden alle spelletjes in het blok ook verwijderd.
        </p>
        <p>
          Binnen een blok kunnen nieuwe regels toegevoegd worden met de
          <span class="icon">${renderPlusIcon()}</span> tussen de regels. Er zal
          automatisch in elke regel één spelletje geplaatst worden. Met
          <span class="icon">${renderPlusIcon()}</span>
          links en rechts kan er nog tweede spelletje toegevoegd worden op de
          regel. Een spelletje kan weer verwijderd worden met
          <span class="icon">${renderTranscanIcon()}</span> vlak boven het
          spelletje. Als alle spelletjes op een regel verwijderd worden, wordt
          de hele regel verwijderd.
        </p>
        <p>
          Je voegt een spelletje toe door de link naar dat spelletje te
          kopiëren. Ga daarvoor naar de gewone overzichtspagina met spelletjes
          van jufankie.nl. Klik met de rechtermuisknop op het spelletje en kies
          Link kopiëren. Ga daarna terug naar de doelenkaart. Klik op het
          <span class="icon">${renderEditIcon()}</span> boven het spelletje en
          plak de gekopieerde link.
        </p>
        <p>
          Met <span class="icon"><img src=${hourGlassIcons.a.href} /></span>,
          <span class="icon"><img src=${hourGlassIcons.b.href} /></span> en
          <span class="icon"><img src=${hourGlassIcons.c.href} /></span> kun je
          de speeltijd instellen op 1, 3 of 5 minuten (voor spelletjes met een
          speeltijd).
        </p>
        <p>
          Je kunt zowel de titel van de doelenkaart als de titels van de
          afzonderlijke blokken aanpassen met
          <span class="icon">${renderEditIcon()}</span>.
        </p>
        <p>
          Boven de doelenkaart die gemaakt is vind je de link naar je gemaakte
          doelenkaart. Met deze link kunnen kinderen de doelenkaart openen en de
          spelletjes spelen. De doelenkaar verschijnt niet op jufankie.nl.
        </p>
        <p>
          <b>Bewaar deze link goed!</b> De doelenkaart wordt niet apart
          opgeslagen: alle gegevens zitten in de link zelf. Ben je de link
          kwijt, dan kun je de doelenkaart niet terughalen en moet je deze
          opnieuw maken.
        </p>
        <p>
          Wil je een eerder gemaakte doelenkaart aanpassen of als uitgangspunt
          gebruiken voor een nieuwe kaart? Plak dan de link van die doelenkaart
          in het veld <i>Basis doelenkaart</i>. De doelenkaart wordt geladen en
          je kunt de inhoud aanpassen.
        </p>
      </details>
    `;
  }

  renderLinkInfo(): HTMLTemplateResult {
    const link = new URL(
      `./CustomIndex.html?d=${encodeGoalCardInfo(this.goalCardInfo)}`,
      baseUrl,
    );
    return html`
      <div class="block">
      <div class="blockHeader">Links</div>
      <p><b>Basis doelenkaart:</b>
      <input id="baseGoalCard" ${ref(this.baseGoalCardInputRef)} />
      <button @click=${() => this.handleUpdateBaseGoalcard()}>
        Laad doelenkaart
      </button></p>
      <p>
        <b>Link voor de gemaakte doelenkaart: </b></br>
      <a href=${link.href}>${link.href}</a></p>

      </div>
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <h1>${this.pageTitle}</h1>
      ${this.renderExplanation()} ${this.renderLinkInfo()}
      <div class="block">
        <div class="blockHeader">Doelenkaart editor</div>
        <editable-goalcard-widget
          @goalCardInfo-changed=${(e: CustomEvent<GoalCardInfo>) =>
            this.onGoalCardInfoChanged(e.detail)}
          .goalCardInfo=${this.goalCardInfo}
        ></editable-goalcard-widget>
      </div>

      <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>
    `;
  }
}
