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

const splitString = (str: string, n: number): string[] => {
  let arr = str?.split(" ");
  let result = [];
  let subStr = arr[0];
  for (let i = 1; i < arr.length; i++) {
    let word = arr[i];
    if (subStr.length + word.length + 1 <= n) {
      subStr = subStr + " " + word;
    } else {
      result.push(subStr);
      subStr = word;
    }
  }
  if (subStr.length) {
    result.push(subStr);
  }
  return result;
};

const argv = Bun.argv;

if (argv.length > 2) {
  const file = argv[2];

  let titleSize: number = 100;
  if (argv.length > 3) titleSize = Number(argv[3]) || 100;

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
          let titleSplit: string[] = splitString(
            title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "").trim(),
            titleSize
          ).map((text) => text.padEnd(titleSize, " "));
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
  console.log("Usage: coc <file> <title_size>");
}