#!/usr/bin/env node

// todo: dev, clean
const argv = require('minimist')(process.argv.slice(2))
const { msg } = require('./msg')

const input = argv.i || argv.input || '.'
const output = argv.o || argv.output || '_dist'

console.log(input, output, typeof msg)
msg(input, output)
