<template>
  <MarkDisplay :markdown="content" autoBaseUrl autoBlankTarget autoFontSize keyboardCtrl urlHashCtrl supportPreview />
</template>

<script>
import MarkDisplay from 'vue-mark-display';

export default {
  components: {
    MarkDisplay
  },
  props: {
    content: String
  }
}
</script>
