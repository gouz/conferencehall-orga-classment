#!/usr/bin/env bun
import { CommanderError, program } from "commander";
import packagejson from "../package.json";
import choc from "./choc";

function myParseInt(value: string) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new CommanderError(0, "nan", "Not a number.");
  }
  return parsedValue;
}

program
  .name("choc")
  .description("ConferenceHall organization companion")
  .version(packagejson.version, "-v, --version");

program
  .argument("<json>", "the json export file")
  .option("-c, --with-categories", "view categories", false)
  .option("-f, --with-formats", "view formats", false)
  .option("-e, --with-companies", "view speakers company", false)
  .option("-a, --with-addresses", "view speakers address", false)
  .option("-l, --with-languages", "view talks language", false)
  .option("-t, --titlelength <int>", "the title length", myParseInt, 100)
  .option("-w, --links <eventId>", "view links")
  .option("-x, --export <file>", "export into tsv file")
  .option("-r, --render", "render on a webpage", false)
  .action(choc);

program.parse();
