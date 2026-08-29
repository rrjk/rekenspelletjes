import { TimeCode } from '../TimeCodes';

export type Entry<Game extends string> = {
  game: Game;
  variant: string;
  timeCode?: TimeCode;
};

export type Row<Game extends string> = {
  entries: Entry<Game>[];
};

export type SectionInfo<Game extends string> = {
  title: string;
  rows: Row<Game>[];
};

export type SectionInfoList<Game extends string> = SectionInfo<Game>[];
