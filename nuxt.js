const fs = require('fs')
const path = require('path')

exports.genPath = baseUrl => {
  const root = path.resolve(baseUrl, 'nuxt')
  const static = path.resolve(root, 'static')
  const pages = path.resolve(root, 'pages')
  const indexPage = path.resolve(pages, 'index.vue')
  const readmePage = path.resolve(pages, 'README.vue')
  const themeFile = path.resolve(root, 'components/theme.css')
  const buildDir = path.resolve('.', '.nuxt')

  return {
    root,
    static,
    pages,
    indexPage,
    readmePage,
    themeFile,
    buildDir
  }
}

exports.genTemplatePath = baseUrl => {
  const directories = [
    'static',
    'pages',
    'components'
  ]
  const files = [
    'components/slides.vue',
    'components/theme.css',
    'components/joycon.js'
  ]
  const root = path.resolve(__dirname, 'template')
  const pagePath = path.resolve(root, 'pages', 'template.vue')
  const page = fs.readFileSync(pagePath, { encoding: 'utf8' })
  const pageGenerator = content =>
    page.replace(/\`\<TEMPLATE_CONTENT\>\`/, content.replace(/\$/g, '&dollar;'))

  return {
    root,
    directories,
    files,
    pagePath,
    page,
    pageGenerator
  }
}

exports.genConfig = () => ({
  mode: 'spa',

  dev: false,

  build: {
    analyze: false
  },

  generate: {},

  router: { base: '/' },

  srcDir: './nuxt',

  /*
  ** Headers of the page
  */
  head: {
    title: "My Slides",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "My slides" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
})
