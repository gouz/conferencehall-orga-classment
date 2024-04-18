import type {
  Format,
  Options,
  Speaker,
  SpeakerData,
  Talk,
  TalkRow,
} from "./types";
import { removeEmojis, splitString } from "./utils";

const choc = async (file: string, options: Options) => {
  const { talks, speakers, formats, categories } = await Bun.file(file).json();
  const formatsHash = new Map<string, string>();
  (formats as Format[]).forEach(({ id, name }) => {
    formatsHash.set(id, removeEmojis(name));
  });
  const speakerHash = new Map<string, SpeakerData>();
  (speakers as Speaker[]).forEach(({ uid, displayName, company }) => {
    speakerHash.set(uid, {
      name: removeEmojis(displayName),
      company: removeEmojis(company ?? ""),
    });
  });
  const categoriesHash = new Map<string, string>();
  (categories as Format[]).forEach(({ id, name }) => {
    categoriesHash.set(id, removeEmojis(name));
  });
  console.table(
    (talks as Talk[])
      .sort((a, b) => (a.rating <= b.rating ? 1 : -1))
      .flatMap(
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
                rating: Number(rating.toFixed(2)),
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
      )
  );
};

export default choc;
