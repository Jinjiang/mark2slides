#!/usr/bin/env node

const path = require('path')
const ora = require('ora')
const execa = require('execa')
const cmdPath = path.resolve(__dirname, './cmd.js')

const run = async () => {
  const childProcess = execa.node(cmdPath, [...process.argv])

  const debugMode = process.argv.indexOf('--debug') >= 0
  if (debugMode) {
    console.log('!!! debug mode !!!')
  }

  const spinner = ora('Processing...')

  childProcess.stdout.on('data', data => {
    const dataStr = data.toString()
    if (dataStr.match(/^\[m2s\]/)) {
      const content = dataStr.substr(5)
      process.stdout.write(content)
      if (content.match(/^\[start\]/)) {
        spinner.start()
      } else if (content.match(/^\[done\]/)) {
        spinner.stop()
        spinner.clear()
      }
    } else if (debugMode) {
      process.stdout.write('[debug] ' + dataStr)
    }
  })

  childProcess.stderr.on('data', data => {
    spinner.stop()
    spinner.clear()
    const dataStr = data.toString()
    if (dataStr.match(/^\[m2s\]/)) {
      process.stderr.write(dataStr.substr(5))
    } else if (debugMode) {
      process.stderr.write('[debug] ' + dataStr)
    }
  })

  try {
    await childProcess
  } catch (error) {
    console.error(error)
  }

  spinner.stop()
  spinner.clear()
}

run()
