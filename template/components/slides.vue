<template>
  <MarkDisplay
    ref="main"
    :markdown="content"
    @title="setTitle"
    autoBaseUrl
    autoBlankTarget
    autoFontSize
    keyboardCtrl
    urlHashCtrl
    supportPreview />
</template>

<script>
import MarkDisplay from 'vue-mark-display'
import Hammer from "hammerjs";
import JoyCon from "./joycon";

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
  created() {
    const search = location.search;
    if (search.length > 1) {
      this.src = search.substr(1);
    }
  },
  mounted() {
    const main = this.$refs.main;

    // gestures
    const mc = new Hammer(this.$el);
    mc.on("swipe", event => {
      if (event.pointerType === "mouse") {
        return;
      }
      switch (event.direction) {
        case Hammer.DIRECTION_LEFT:
          main.goNext();
          return;
        case Hammer.DIRECTION_RIGHT:
          main.goPrev();
          return;
      }
    });

    // joycon
    joyCon.start();
    joyCon.on("keydown", event => {
      switch (event.code) {
        case "left":
        case "down":
        case "A":
        case "B":
        case "plus":
        case "SR-L":
        case "SR-R":
          main.goNext();
          return;
        case "right":
        case "up":
        case "X":
        case "Y":
        case "minus":
        case "SL-L":
        case "SL-R":
          main.goPrev();
          return;
      }
    });
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

h1, h2, h3, p {
  margin: 0 0 0.5em;
}
ul, ol {
  text-align: initial;
  margin: 0 0 0.5em 1em;
}
img, video {
  max-width: 80vw;
  max-height: 60vh;
  border-radius: 0.5vw;
}
blockquote {
  font-family: cursive;
  font-size: 0.75em;
  text-align: initial;
  background: rgba(225,225,225,.75);
  padding: 0.5em 1em;
  border-radius: 0.5vw;
}
kbd {
  display: inline-block;
  padding: 0.1em 0.3em;
  color: #555;
  text-align: center;
  min-width: 1em;
  height: 1.5em;
  line-height: 1.5;
  vertical-align: baseline;
  background-color: #fcfcfc;
  border: solid 1px #ccc;
  border-bottom-color: #bbb;
  border-radius: 0.2em;
  box-shadow: inset 0 -1px 0 #bbb;
}

credits {
  position: absolute;
  right: 2vw;
  bottom: 2vh;
  font-size: 16px;
  font-style: italic;
  color: gray;
}
credits::before {
  content: "Credits: ";
}
</style>
