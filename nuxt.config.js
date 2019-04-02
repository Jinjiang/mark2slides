module.exports = {
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
}
