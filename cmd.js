#!/usr/bin/env node

const fs = require('fs')
const minimist = require('minimist')
const { msg, clean } = require('./msg')

const argv = minimist(process.argv.slice(2))

const help = () => console.log(`
Hello, I'm a markdown-to-slides generator.

Usage: m2s <command> [options]

Options:
  -i, --input       input directory or markdown file, "." by default
  -o, --output      output directory, "dist" by default

Commands:
  build [options]   generate all markdown into slides
  clean             clean all temp files manually
  help
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
    const input = argv.i || argv.input || '.'
    const output = argv.o || argv.output || 'dist'
    const baseUrl = argv.b || argv.base || '/'
    msg(input, output, baseUrl)
    return
  default:
    if (argv.h || argv.help) {
      help()
      return
    }
    if (fs.lstatSync(cmd).isFile()) {
      const output = argv.o || argv.output || 'dist'
      const baseUrl = argv.b || argv.base || '/'
      msg(cmd, output, baseUrl)
      return
    }
    console.error(`Sorry, command "${cmd}" not supported.`)
}
