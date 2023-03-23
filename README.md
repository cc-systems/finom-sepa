# finom-sepa

Finom is a German fintech bank startup. They do not support SEPA.xml bulk transactions (cf. https://finom.nolt.io/119).

This tool allows to convert a SEPA xml file to finom's bulk CSV format.

## Installation

Install dependencies using yarn.

```sh
yarn
```

## Usage

The program takes a sepa file and dumps the CSV to stdin.

```
Usage: index [options] <sepa.xml>

CLI to convert SEPA XML files into a multi transfer CSV file that can be used with finom

Arguments:
  sepa.xml    SEPA XML file to convert

Options:
  -h, --help  display help for command
```

### Example

```sh
yarn -s start ~/sepa.xml > finom.csv
```

## Notes

This is a very hacky tool that only considers the happiest path. There is no validation and nearly no sanity check that your input fits expectations. Good luck!
