# mark2slides

> This repo is not under maintenance anymore. You can refer to a similar project called [Slidev](https://sli.dev/).

A tool to generate slides from markdown file(s).

Install: `yarn global add mark2slides` or `npm install mark2slides --global`

``` bash
Hello, I'm a markdown-to-slides generator.

Usage: m2s <command> [options]

Options:
  -i, --input       input directory or markdown file, "." by default
  -o, --output      output directory, "dist" by default
  -b, --base        base path of the generated code, "/" by default
  -t, --theme       path of a a CSS file applied to all slides
  -c, --config      config file, ".mdrc" by default

Commands:
  build [options]   generate all markdown into slides
  clean             clean all temp files manually
  help

Config File:
  A JSON file which supports all options except "--config".
  And additionally it has two optional fields: "ignore" and "static".
  Both of them are array of string, which would be used to match all
  first-level sub directories in the target directory.
  But please notice the priority of command arguments are higher than
  this config file. That means you can use command arguments to
  overwrite this config file after the file is written down.
  For example:
  {
    "input": ".",
    "output": "dist",
    "base": "/",
    "theme": "theme.css",
    "ignore": ["dist", "theme.css"],
    "static": ["assets", "images"]
  }
```
