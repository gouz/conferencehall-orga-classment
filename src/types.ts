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
  address: Address;
};

export type SpeakerData = {
  name: string;
  company: string;
  address: string;
};

export type Address {
  formattedAddress: string;
}

export type Talk = {
  id: string;
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
  withAddresses: boolean;
  titlelength: number;
  render: boolean;
  links?: string;
  export?: string;
  useApi: boolean;
};

export type Export = {
  talks?: object[];
  speakers?: object[];
  formats?: object[];
  categories?:object[];
}