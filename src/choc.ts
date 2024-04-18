import { DTO, DTOExport } from "./DTO";
import type {
  Format,
  Options,
  Speaker,
  SpeakerData,
  Talk,
  TalkRow,
} from "./types";
import { removeEmojis } from "./utils";

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
  const talksLines = (talks as Talk[]).sort((a, b) =>
    a.rating <= b.rating ? 1 : -1
  );
  if (options.export) {
    const exportLines = DTOExport(
      talksLines,
      options,
      speakerHash,
      formatsHash,
      categoriesHash
    );
    Bun.write(
      options.export,
      `${Object.keys(exportLines[0]).join("\t")}\n${exportLines
        .map((t: TalkRow) => Object.values(t).join("\t"))
        .join("\n")}`
    );
  } else
    console.table(
      DTO(talksLines, options, speakerHash, formatsHash, categoriesHash)
    );
};

export default choc;
