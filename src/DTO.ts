import type { Options, SpeakerData, Talk, TalkRow } from "./types";
import { removeEmojis, splitString } from "./utils";

const getCompanies = (speakerHash: Map<string, SpeakerData>, uid: string) => ({
  company: speakerHash.get(uid)?.company,
});

const getAdresses = (speakerHash: Map<string, SpeakerData>, uid: string) => ({
  addresses: speakerHash.get(uid)?.address,
});

const getFormats = (
  formatsHash: Map<string, string>,
  format: string,
  removeEmoji: boolean = false
) => ({
  format: removeEmoji
    ? removeEmojis(formatsHash.get(format))
    : formatsHash.get(format),
});

const getCategories = (
  categoriesHash: Map<string, string>,
  category: string,
  removeEmoji: boolean = false
) => ({
  categories: removeEmoji
    ? removeEmojis(categoriesHash.get(category))
    : categoriesHash.get(category),
});

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
        if (i === 0) {
          lines.push({
            position: position + 1,
            title: titleSplit.shift(),
            ...(options.withFormats
              ? getFormats(formatsHash, formats, true)
              : {}),
            ...(options.withCategories
              ? getCategories(categoriesHash, categories, true)
              : {}),
            speakers: speakerHash.get(uid)?.name,
            ...(options.withCompanies ? getCompanies(speakerHash, uid) : {}),
            ...(options.withAddresses ? getAdresses(speakerHash, uid) : {}),
            ...(options.withLanguages ? { language } : {}),
            rating: Number(Number(rating ?? "0").toFixed(2)),
            loves,
            hates,
            ...(options.links
              ? {
                  link: `https://conference-hall.io/organizer/event/${options.links}/proposals/${id}`,
                }
              : {}),
          });
        } else
          lines.push({
            title: titleSplit.shift() ?? "",
            speakers: speakerHash.get(uid)?.name,
            ...(options.withCompanies ? getCompanies(speakerHash, uid) : {}),
            ...(options.withAddresses ? getAdresses(speakerHash, uid) : {}),
          });
      });
      titleSplit.forEach((title) => lines.push({ title }));
      lines.push({});
      return lines;
    }
  );

const cleanArray = (arrayString: (string | undefined)[]): string[] =>
  Array.from(
    new Set(arrayString.map((c) => c?.toLowerCase() ?? "").filter((c) => c))
  ).sort((a, b) => a.localeCompare(b));

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
    ) => ({
      position: position + 1,
      title: title,
      ...(options.withFormats ? getFormats(formatsHash, formats) : {}),
      ...(options.withCategories
        ? getCategories(categoriesHash, categories)
        : {}),
      speakers: speakers
        .map((uid: string) => speakerHash.get(uid)?.name)
        .join(", "),
      ...(options.withCompanies
        ? {
            company: cleanArray(
              speakers.map((uid: string) => speakerHash.get(uid)?.company)
            ).join(", "),
          }
        : {}),
      ...(options.withAddresses
        ? {
            address: cleanArray(
              speakers.map((uid: string) => speakerHash.get(uid)?.address)
            ),
          }
        : {}),
      ...(options.withLanguages ? { language } : {}),
      rating: Number(Number(rating ?? "0").toFixed(2)),
      loves,
      hates,
      ...(options.links
        ? {
            link: `https://conference-hall.io/organizer/event/${options.links}/proposals/${id}`,
          }
        : {}),
    })
  );
