#!/usr/bin/env node

const fs = require('fs')
const minimist = require('minimist')
const { clean, build } = require('./msg')

const argv = minimist(process.argv.slice(2))

const help = () => console.log(`
Hello, I'm a markdown-to-slides generator.

Usage: m2s <command> [options]

Options:
  -i, --input       input directory or markdown file, "." by default
  -o, --output      output directory, "dist" by default
  -b, --base        base path of the generated code, "/" by default
  -c, --config      config file, ".mdrc" by default

Commands:
  build [options]   generate all markdown into slides
  clean             clean all temp files manually
  help

Config File:
  A JSON file which has two optional fields: "ignore" and "static".
  Both are an array of "minimatch" string, which would be used
  to match all first-level sub directories in the target directory.
  For example:
  {
    "ignore": ["dist"],
    "static": ["assets", "images"]
  }

`.trim())

if (argv._.length > 1) {
  if (argv.h || argv.help) {
    help()
    return
  }
  console.error(`Sorry, you couldn't run more than one commands at the same time.`)
  return
}

const cmd = argv._[0]

switch (cmd) {
  case 'clean':
    if (argv.h || argv.help) {
      help()
      return
    }
    clean()
    return
  case undefined:
  case 'help':
    help()
    return
  case 'build':
    if (argv.h || argv.help) {
      help()
      return
    }
    const argInput = argv.i || argv.input
    const argOutput = argv.o || argv.output
    const argBaseUrl = argv.b || argv.base
    const rcUrl = argv.c || argv.rc || '.mdrc'
    let config = {}
    try {
      if (fs.existsSync(rcUrl)) {
        config = JSON.parse(fs.readFileSync(rcUrl, { encoding: 'utf8' }))
      }
    } catch (error) {
      console.error(error)
    }
    const { ignore, static, output, input, base } = config
    build(argInput || input || '.', {
      output: argOutput || output || 'dist',
      baseUrl: argBaseUrl || base || '/',
      ignore, static
    })
    return
  default:
    if (argv.h || argv.help) {
      help()
      return
    }
    if (fs.lstatSync(cmd).isFile()) {
      const output = argv.o || argv.output || 'dist'
      const baseUrl = argv.b || argv.base || '/'
      build(cmd, { output, baseUrl })
      return
    }
    console.error(`Sorry, command "${cmd}" not supported.`)
}
