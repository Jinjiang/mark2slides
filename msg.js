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
const path = require('path')
const fs = require('fs-extra')
const readdirp = require('readdirp')
const { Nuxt, Builder, Generator } = require('nuxt')
const config = require('./nuxt.config.js')

const nuxtRoot = path.join(__dirname, 'nuxt')
const nuxtStatic = path.join(nuxtRoot, 'static')
const nuxtPages = path.join(nuxtRoot, 'pages')
const nuxtIndexPage = path.join(nuxtPages, 'index.vue')
const nuxtReadmePage = path.join(nuxtPages, 'README.vue')
const buildDir = path.join(__dirname, '.nuxt')

const templateRoot = path.join(__dirname, 'template')
const templateDirs = [
  'static',
  'pages',
  'components'
]
const templateFiles = [
  'components/slides.vue',
  'components/joycon.js'
]
const pageTemplatePath = path.join(templateRoot, 'pages', 'template.vue')
const pageTemplate = fs.readFileSync(pageTemplatePath, { encoding: 'utf8' })
const generatePage = content => pageTemplate.replace(/\`\<TEMPLATE_CONTENT\>\`/, content.replace(/\$/g, '&dollar;'))

const init = (src = '.', filter, callback) => {
  // prepare template
  fs.ensureDirSync(nuxtRoot)
  templateDirs.map(filepath => path.join(nuxtRoot, filepath)).forEach(filepath => {
    fs.ensureDirSync(filepath)
  })
  templateFiles.forEach(filepath => {
    fs.copySync(
      path.join(templateRoot, filepath),
      path.join(nuxtRoot, filepath)
    )
  })
  // copy file(s)
  const inputRoot = path.resolve(src)
  if (fs.lstatSync(inputRoot).isDirectory()) {
    // for directory, copy all files for generating a whole spa
    const copyOptions = filter ? { filter } : {}
    fs.copySync(inputRoot, nuxtStatic, copyOptions)
    const pages = []
    readdirp({
      root: nuxtStatic,
      fileFilter: ['*.md'],
      depth: 1
    }).on('data', entry => {
      const [, name] = entry.path.match(/^([^\/]+)(\/README\.md|\.md)$/) || []
      if (name) {
        const content = fs.readFileSync(entry.fullPath, { encoding: 'utf8' })
        const output = generatePage(JSON.stringify(content))
        fs.outputFileSync(path.join(nuxtPages, `${name}.vue`), output)
        pages.push(name)
      }
    }).on('end', () => {
      // `pages/index.vue`
      if (!fs.existsSync(nuxtIndexPage)) {
        if (fs.existsSync(nuxtReadmePage)) {
          fs.moveSync(nuxtReadmePage, nuxtIndexPage)
        } else {
          const indexContent = pages.map(name => `- [${name}](./${name})`).join('\n')
          const indexOutput = generatePage(JSON.stringify(`### My Slides\n\n${indexContent}`))
          fs.outputFileSync(nuxtIndexPage, indexOutput)
        }
      }
      callback && callback({ isFile: false })
    })
  } else if (fs.lstatSync(inputRoot).isFile()) {
    // for file, copy it into pages/index.vue for generating just one slides
    const content = fs.readFileSync(inputRoot, { encoding: 'utf8' })
    const output = generatePage(JSON.stringify(content))
    fs.outputFileSync(nuxtIndexPage, output)
    callback && callback({ isFile: true })
  } else {
    console.error('Input source error!')
  }
}

const generate = (output, baseUrl, callback) => {
  config.srcDir = nuxtRoot
  if (output) {
    config.generate.dir = path.resolve(output)
  }
  if (baseUrl) {
    config.build.extend = config => {
      config.output.publicPath = `/${baseUrl}/_nuxt/`.replace(/\/\//g, '/')
    }
    config.router.base = `/${baseUrl}/`.replace(/\/\//g, '/')
  }
  const nuxt = new Nuxt(config)
  const builder = new Builder(nuxt)
  const generator = new Generator(nuxt, builder)
  generator.generate().then(() => {
    console.log(`\n[finished] all slides generated in ${output}\n`)
    callback && callback()
  })
}

const clean = () => {
  fs.removeSync(path.resolve('.nuxt'))
  fs.removeSync(path.join(__dirname, 'nuxt'))
}

const msg = (src = '.', dist = 'dist', baseUrl = '/') => {
  init(src,
    filepath => filepath !== path.resolve('.', dist),
    ({ isFile }) => generate(dist, isFile ? './' : baseUrl, clean))
}

exports.init = init
exports.generate = generate
exports.clean = clean
exports.msg = msg
