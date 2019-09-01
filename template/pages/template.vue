<template>
  <Slides :content="content" />
</template>

<script>
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { setHighlighter } from "vue-mark-display";

import Slides from '~/components/slides.vue'

setHighlighter(code => hljs.highlightAuto(code).value || code);

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
  margin: 0;
  overflow: hidden;
}
</style>
