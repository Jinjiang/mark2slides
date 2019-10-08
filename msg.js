/**
 * [todo]
 * - [ ] custom hammerjs
 * - [ ] custom highlight.js
 * - [ ] custom style
 */

/**
 * 0. prepare nuxt project
 *   - `static/`
 *   - `pages/`
 *   - `components/`
 *     - `slides.vue`
 * 1. cp all files into`static`
 * 2. find all`<name>.md` or`<name>/README.md`
 * 3. generate`pages/<name>.vue`
 * 4. generate`pages/index.vue`
 * 5. build
 */

// ---- dependencies ----

const path = require('path')
const fs = require('fs-extra')
const readdirp = require('readdirp')
const minimatch = require('minimatch')
const { Nuxt, Builder, Generator } = require('nuxt')

// ---- prepare nuxt env ----

const { genConfig, genPath, genTemplatePath } = require('./nuxt.js')
const nuxtPath = genPath(__dirname)
const templatePath = genTemplatePath(__dirname)

const transformFile = (src, dist) => {
  const content = fs.readFileSync(src, { encoding: 'utf8' })
  const output = templatePath.pageGenerator(JSON.stringify(content))
  fs.outputFileSync(dist, output)
}

const transformPage = (name, src, dist) => {
  const content = fs.readFileSync(src, { encoding: 'utf8' })
  const output = templatePath.pageGenerator(JSON.stringify(content))
  fs.outputFileSync(path.join(dist, `${name}.vue`), output)
}

const transformIndex = (pageList, dist) => {
  const content = pageList.map(name => `- [${name}](./${name})`).join('\n')
  const output = templatePath.pageGenerator(JSON.stringify(`### My Slides\n\n${content}`))
  fs.outputFileSync(dist, output)
}

const checkInputType = src => {
  const target = fs.lstatSync(path.resolve(src))
  if (target.isFile()) {
    return 'file'
  } else if (target.isDirectory()) {
    return 'directory'
  }
  return ''
}

// ---- build process ----

const clean = () => {
  fs.removeSync(nuxtPath.root)
  fs.removeSync(nuxtPath.buildDir)
}

const prepareTemplate = () => {
  fs.ensureDirSync(nuxtPath.root)
  templatePath.directories
    .map(filepath => path.resolve(nuxtPath.root, filepath))
    .forEach(filepath => fs.ensureDirSync(filepath))
  templatePath.files
    .forEach(filepath => 
      fs.copySync(
        path.join(templatePath.root, filepath),
        path.join(nuxtPath.root, filepath)))
}

const prepareFile = (src) => {
  // just transform one file
  transformFile(path.resolve(src), nuxtPath.indexPage)
}

const prepareDirectory = (src, config) => {
  const { dist, ignore, static } = config
  const filterList = [dist, ...ignore, ...static]

  // generate pages
  const pageList = []
  const fullSrc = path.resolve(src)
  fs.readdirSync(fullSrc).forEach(file => {

    // ignore hidden files/dirs
    if (file.match(/^\./)) {
      return
    }

    // filter first
    if (filterList.some(rule => minimatch(file, rule))) {
      return
    }

    // check the target is file or directory
    const fullPath = path.resolve(src, file)
    const target = fs.lstatSync(fullPath)
    if (target.isFile()) {
      if (file.match(/^.+\.md$/)) {
        // single markdown file
        const name = file.substr(0, file.length - 3)
        fs.copySync(fullPath, path.resolve(nuxtPath.static, file))
        transformPage(name, fullPath, nuxtPath.pages)
        pageList.push(name)
      }
    } else if (target.isDirectory()) {
      const targetFileFullPath = path.resolve(fullPath, 'README.md')
      const targetFile = fs.lstatSync(targetFileFullPath)
      if (targetFile.isFile()) {
        // folder with README.md
        const name = file
        fs.copySync(fullPath, path.resolve(nuxtPath.static, file))
        transformPage(name, targetFileFullPath, nuxtPath.pages)
        pageList.push(name)
      }
    }
  })

  // generate index
  if (!fs.existsSync(nuxtPath.indexPage)) {
    if (fs.existsSync(nuxtPath.readmePage)) {
      fs.moveSync(nuxtPath.readmePage, nuxtPath.indexPage)
    } else {
      transformIndex(pageList, nuxtPath.indexPage)
    }
  }
}

const generate = async (dist, baseUrl) => {
  const config = genConfig()
  config.srcDir = nuxtPath.root
  config.generate.dir = path.resolve(dist)
  config.build.extend = config => {
    config.output.publicPath = `/${baseUrl}/_nuxt/`.replace(/\/{2,}/g, '/')
  }
  config.router.base = `/${baseUrl}/`.replace(/\/{2,}/g, '/')
  const nuxt = new Nuxt(config)
  const builder = new Builder(nuxt)
  const generator = new Generator(nuxt, builder)
  await generator.generate()
  console.log(`\n[finished] all slides generated in ${dist}\n`)
}

const copy = (static, dist) => static.forEach(
  file => fs.copySync(path.resolve(file), path.resolve(dist, file)))

// ---- entry point ----

const build = async (src = '.', { output, baseUrl, ignore, static }) => {
  const config = {
    dist: output || 'dist',
    ignore: ignore || [],
    static: static || []
  }
  clean()
  prepareTemplate()
  const inputType = checkInputType(src)
  if (inputType === 'file') {
    prepareFile(src)
    await generate(config.dist, baseUrl || '/')
  } else if (inputType === 'directory') {
    prepareDirectory(src, config)
    await generate(config.dist, baseUrl || '/')
  }
  copy(config.static, config.dist)
  clean()
}

exports.clean = clean
exports.build = build
