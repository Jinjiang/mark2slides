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
const buildDir = path.join(__dirname, '.nuxt')

const templateRoot = path.join(__dirname, 'template')
const templateDirs = [
  'static',
  'pages',
  'components'
]
const templateFiles = [
  'components/slides.vue'
]
const pageTemplatePath = path.join(templateRoot, 'pages', 'template.vue')
const pageTemplate = fs.readFileSync(pageTemplatePath, { encoding: 'utf8' })
const generatePage = content => pageTemplate.replace(/\`\<TEMPLATE_CONTENT\>\`/, content)

const init = (src = '.', filter, callback) => {
  const inputRoot = path.resolve(src)
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
    const indexContent = pages.map(name => `- [${name}](./${name})`).join('\n')
    const indexOutput = generatePage(JSON.stringify(`### My Slides\n\n${indexContent}`))
    fs.outputFileSync(path.join(nuxtPages, 'index.vue'), indexOutput)
    callback && callback()
  })
}

const generate = (output, callback) => {
  config.srcDir = nuxtRoot
  if (output) {
    config.generate.dir = path.resolve(output)
  }
  const nuxt = new Nuxt(config)
  const builder = new Builder(nuxt)
  const generator = new Generator(nuxt, builder)
  generator.generate().then(() => {
    console.log(`[finished] all slides generated in ${output}`)
    callback && callback()
  })
}

const clean = () => {
  fs.removeSync(path.resolve('.nuxt'))
  fs.removeSync(path.join(__dirname, 'nuxt'))
}

const msg = (src = '.', dist = 'dist') => {
  init(src,
    filepath => filepath !== path.resolve('.', dist),
    () => generate(dist, clean))
}

exports.init = init
exports.generate = generate
exports.clean = clean
exports.msg = msg
