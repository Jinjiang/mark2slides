#!/usr/bin/env node

const minimist = require('minimist')
const { msg, clean } = require('./msg')

const argv = minimist(process.argv.slice(2))
// console.log(argv)

const help = () => console.log(`
Hello, I'm a markdown-to-slides generator.

Usage: msg <command> [options]

Options:
  -i, --input       input directory, "." by default
  -o, --output      output directory, "dist" by default

Commands:
  build [options]   generate all markdown into slides
  clean             clean all temp files manually
  help
`.trim())

if (argv._.length > 1) {
  console.error(`Sorry, you couldn't run more than one commands at the same time.`)
  return;
}

const cmd = argv._[0]

switch (cmd) {
  case 'clean':
    if (argv.h || argv.help) {
      // console.log('help')
      help()
      break
    }
    // console.log('clean()')
    clean()
    break
  case undefined:
  case 'help':
    // console.log('help')
    help()
    break
  case 'build':
    if (argv.h || argv.help) {
      // console.log('help')
      help()
      break
    }
    const input = argv.i || argv.input || '.'
    const output = argv.o || argv.output || 'dist'
    // console.log('msg(input, output)')
    msg(input, output)
    break
  default:
    if (argv.h || argv.help) {
      // console.log('help')
      help()
      break
    }
    console.error(`Sorry, command "${cmd}" not supported.`)
}
