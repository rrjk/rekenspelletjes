import { HTMLTemplateResult } from 'lit';
import { ClassInfo } from 'lit/directives/class-map.js';
import { TimeCode } from './TimeCodes';

export type RenderGameIconFunction = (
  timeCode: TimeCode,
  variant: string,
  classes: ClassInfo,
) => HTMLTemplateResult;
