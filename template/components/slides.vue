<template>
  <MarkDisplay :markdown="content" @title="setTitle" autoBaseUrl autoBlankTarget autoFontSize keyboardCtrl urlHashCtrl supportPreview />
</template>

<script>
import MarkDisplay from 'vue-mark-display'

export default {
  components: {
    MarkDisplay
  },
  props: {
    content: String
  },
  methods: {
    setTitle({ title }) {
      setTimeout(() => {
        document.title = title || "My Slides"
      })
    }
  }
}
</script>
