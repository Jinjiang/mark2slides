<template>
  <Slides :content="content" />
</template>

<script>
import Slides from '~/components/slides.vue'
const content = `<TEMPLATE_CONTENT>`
export default {
  components: { Slides },
  data() {
    return {
      content
    }
  }
}
</script>

<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  color: #2c3e50;
}
</style>
