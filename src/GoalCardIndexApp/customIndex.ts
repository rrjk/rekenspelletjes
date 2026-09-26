import { customElement, state } from 'lit/decorators.js';

import { GoalCardIndexApp } from './GoalCardIndexApp';

import { decodeGoalCardInfo } from './SectionInfoType';
import { storeMenuPage } from '../NavigationHelper';

@customElement('custom-index-app')
export class CustomIndexApp extends GoalCardIndexApp {
  @state()
  accessor goalCardTitle = '';

  parseUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedSectionInfoList = urlParams.get('d');
    const goalCardInfo = decodeGoalCardInfo(encodedSectionInfoList ?? '');
    this.sections = goalCardInfo.sections;
    this.goalCardTitle = goalCardInfo.goalCardTitle;
  }

  constructor() {
    super();
    storeMenuPage();
    this.parseUrlParameters();
  }

  get pageTitle(): string {
    return this.goalCardTitle;
  }
}
