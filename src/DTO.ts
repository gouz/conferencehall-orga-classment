import type { Options, SpeakerData, Talk, TalkRow } from "./types";
import { removeEmojis, splitString } from "./utils";

export const DTO = (
  talks: Talk[],
  options: Options,
  speakerHash: Map<string, SpeakerData>,
  formatsHash: Map<string, string>,
  categoriesHash: Map<string, string>
): TalkRow[] =>
  talks.flatMap(
    (
      {
        id,
        title,
        speakers,
        formats,
        categories,
        rating,
        loves,
        hates,
        language,
      },
      position: number
    ) => {
      const lines: TalkRow[] = [];
      let titleSplit: string[] = splitString(
        removeEmojis(title),
        options.titlelength
      ).map((text) => text.padEnd(options.titlelength, " "));
      speakers.forEach((uid: string, i: number) => {
        let addCompanies = {};
        if (options.withCompanies)
          addCompanies = {
            company: speakerHash.get(uid)?.company,
          };
        let addAddresses = {};
        if (options.withAddresses)
          addAddresses = {
            addresses: speakerHash.get(uid)?.address,
          };
        if (i === 0) {
          const line = {
            position: position + 1,
            title: titleSplit.shift(),
          };
          let addFormats = {};
          if (options.withFormats)
            addFormats = {
              format: formatsHash.get(formats),
            };
          let addCategories = {};
          if (options.withCategories)
            addCategories = {
              categories: categoriesHash.get(categories),
            };
          let addLanguages = {};
          if (options.withLanguages)
            addLanguages = {
              language: language,
            };
          let addLink = {};
          if (options.links) {
            addLink = {
              link: `https://conference-hall.io/organizer/event/${options.links}/proposals/${id}`,
            };
          }
          lines.push({
            ...line,
            ...addFormats,
            ...addCategories,
            speakers: speakerHash.get(uid)?.name,
            ...addCompanies,
            ...addAddresses,
            ...addLanguages,
            rating: Number(Number(rating ?? "0").toFixed(2)),
            loves,
            hates,
            ...addLink,
          });
        } else
          lines.push({
            title: titleSplit.shift() ?? "",
            speakers: speakerHash.get(uid)?.name,
            ...addCompanies,
            ...addAddresses,
          });
      });
      titleSplit.forEach((title) => lines.push({ title }));
      lines.push({});
      return lines;
    }
  );

export const DTOExport = (
  talks: Talk[],
  options: Options,
  speakerHash: Map<string, SpeakerData>,
  formatsHash: Map<string, string>,
  categoriesHash: Map<string, string>
): TalkRow[] =>
  talks.flatMap(
    (
      {
        title,
        speakers,
        formats,
        categories,
        rating,
        loves,
        hates,
        language,
        id,
      },
      position: number
    ) => {
      const line = {
        position: position + 1,
        title: title,
      };
      let addFormats = {};
      if (options.withFormats)
        addFormats = {
          format: formatsHash.get(formats),
        };
      let addCategories = {};
      if (options.withCategories)
        addCategories = {
          categories: categoriesHash.get(categories),
        };
      let addLanguages = {};
      if (options.withLanguages)
        addLanguages = {
          language: language,
        };
      let addCompanies = {};
      if (options.withCompanies)
        addCompanies = {
          company: speakers
            .map((uid: string) => speakerHash.get(uid)?.company)
            .join(", "),
        };
      let addAddresses = {};
      if (options.withAddresses)
        addAddresses = {
          address: speakers
            .map((uid: string) => speakerHash.get(uid)?.address)
            .join(", "),
        };
      let addLink = {};
      if (options.links) {
        addLink = {
          link: `https://conference-hall.io/organizer/event/${options.links}/proposals/${id}`,
        };
      }
      return {
        ...line,
        ...addFormats,
        ...addCategories,
        speakers: speakers
          .map((uid: string) => speakerHash.get(uid)?.name)
          .join(", "),
        ...addCompanies,
        ...addAddresses,
        ...addLanguages,
        rating: Number(Number(rating ?? "0").toFixed(2)),
        loves,
        hates,
        ...addLink,
      };
    }
  );
