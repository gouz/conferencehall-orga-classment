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
      { title, speakers, formats, categories, rating, loves, hates, language },
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
          lines.push({
            ...line,
            ...addFormats,
            ...addCategories,
            speakers: speakerHash.get(uid)?.name,
            ...addCompanies,
            ...addLanguages,
            rating: Number((rating ?? "0").toFixed(2)),
            loves,
            hates,
          });
        } else
          lines.push({
            title: titleSplit.shift() ?? "",
            speakers: speakerHash.get(uid)?.name,
            ...addCompanies,
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
      { title, speakers, formats, categories, rating, loves, hates, language },
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
      return {
        ...line,
        ...addFormats,
        ...addCategories,
        speakers: speakers
          .map((uid: string) => speakerHash.get(uid)?.name)
          .join(", "),
        ...addCompanies,
        ...addLanguages,
        rating: Number((rating ?? "0").toFixed(2)),
        loves,
        hates,
      };
    }
  );
