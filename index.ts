type TalkRow = {
  position?: number;
  title?: string;
  format?: string;
  speakers?: string;
  rating?: number;
  loves?: number;
  hates?: number;
};

type Format = {
  id: string;
  name: string;
};

type Speaker = {
  uid: string;
  displayName: string;
};

type Talk = {
  title: string;
  speakers: string[];
  formats: string;
  rating: number;
  loves: number;
  hates: number;
};

const argv = Bun.argv;

if (argv.length > 2) {
  const file = argv[2];

  const { talks, speakers, formats } = await Bun.file(file).json();
  const formatsHash = new Map<string, string>();
  (formats as Format[]).forEach(({ id, name }) => {
    formatsHash.set(id, name);
  });
  const speakerHash = new Map<string, string>();
  (speakers as Speaker[]).forEach(({ uid, displayName }) => {
    speakerHash.set(uid, displayName);
  });
  console.table(
    (talks as Talk[])
      .sort((a, b) => (a.rating <= b.rating ? 1 : -1))
      .flatMap(
        (
          { title, speakers, formats, rating, loves, hates },
          position: number
        ) => {
          const lines: TalkRow[] = [];
          let titleSplit: string[] = (
            title
              .trim()
              .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")
              .match(/.{1,100}/g) as string[]
          ).map((text) => text.padEnd(100, " "));
          speakers.forEach((uid: string, i: number) => {
            if (i === 0)
              lines.push({
                position: position + 1,
                title: titleSplit.shift(),
                format: formatsHash.get(formats),
                speakers: speakerHash.get(uid),
                rating: Number(rating.toFixed(2)),
                loves,
                hates,
              });
            else
              lines.push({
                title: titleSplit.shift() ?? "",
                speakers: speakerHash.get(uid),
              });
          });
          titleSplit.forEach((title) => lines.push({ title }));
          lines.push({});
          return lines;
        }
      )
  );
} else {
  console.log("Usage: coc <file>");
}
