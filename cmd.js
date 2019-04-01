#!/usr/bin/env node

const minimist = require('minimist')
const { msg, clean } = require('./msg')

const argv = minimist(process.argv.slice(2))
// console.log(argv)

if (argv._.length > 1) {
  console.error(`Sorry, you couldn't run more than one commands at the same time.`)
  return;
}

const cmd = argv._[0]

switch (cmd) {
  case 'clean':
    // console.log('clean()')
    clean()
    break
  case undefined:
  case 'build':
    const input = argv.i || argv.input || '.'
    const output = argv.o || argv.output || 'dist'
    // console.log('msg(input, output)')
    msg(input, output)
    break
  default:
    console.error(`Sorry, command "${cmd}" not supported.`)
}
