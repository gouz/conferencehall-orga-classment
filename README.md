# CHOC

ConferenceHall Organization Companion

This tool takes your export.json and display a table into your terminal with the talks, speakers, ratings, ...

You can export into a TSV file too!

## Installation

```
brew install gouz/tools/choc
```

## Usage

Export a json of your proposal: ![export json on conference-hall.io](assets/exportjson.png)

```
Usage: choc [options] <json>

ConferenceHall organization companion

Arguments:
  json                     the json export file

Options:
  -v, --version            output the version number
  -c, --with-categories    view categories (default: false)
  -f, --with-formats       view formats (default: false)
  -e, --with-companies     view speakers company (default: false)
  -a, --with-addresses     view speakers address (default: false)
  -l, --with-languages     view talks language (default: false)
  -t, --titlelength <int>  the title length (default: 100)
  -w, --links <eventId>    view links
  -x, --export <file>      export into tsv file
  -h, --help               display help for command
```

### Default usage

```
choc export.json
```

![alt text](assets/default.png)

### With options

```
choc -fce export.json
```

![alt text](assets/options.png)
