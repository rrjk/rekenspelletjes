import { customElement } from 'lit/decorators.js';

import { GoalCardIndexApp } from './GoalCardIndexApp';

import { decodeSectionInfoList } from './SectionInfoType';
import { storeMenuPage } from '../NavigationHelper';

@customElement('custom-index-app')
export class CustomIndexApp extends GoalCardIndexApp {
  parseUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedSectionInfoList = urlParams.get('d');
    this.sections = {
      defaultPage: decodeSectionInfoList(encodedSectionInfoList ?? ''),
    };
  }

  constructor() {
    super();
    storeMenuPage();
    this.parseUrlParameters();
  }

  get pageTitle(): string {
    return `Doelenkaart`;
  }
}
