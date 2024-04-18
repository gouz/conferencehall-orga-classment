export type TalkRow = {
  position?: number;
  title?: string;
  format?: string;
  categories?: string;
  speakers?: string;
  rating?: number;
  loves?: number;
  hates?: number;
};

export type Format = {
  id: string;
  name: string;
};

export type Speaker = {
  uid: string;
  displayName: string;
  company: string;
};

export type SpeakerData = {
  name: string;
  company: string;
};

export type Talk = {
  title: string;
  speakers: string[];
  formats: string;
  categories: string;
  rating: number;
  loves: number;
  hates: number;
  language: string;
};

export type Options = {
  withCategories: boolean;
  withCompanies: boolean;
  withFormats: boolean;
  withLanguages: boolean;
  titlelength: number;
};
