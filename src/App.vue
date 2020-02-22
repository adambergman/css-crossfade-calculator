<template>
  <div id="app">
    <h1>CSS Image Crossfade Calculator</h1>
    <h3>
      <a href="https://github.com/adambergman/css-crossfade-calculator">
        View on Github
      </a>
    </h3>
    <div class="form">
      <div>
        Duration of image display (seconds): <input type="number" v-model.number="duration" />
      </div>
      <div>
        Cross fade duration (seconds): <input type="number" v-model.number="crossfade" />
      </div>
      <div>
        Total Images: <input type="number" v-model.number="totalImages" />
      </div>
    </div>
    <div>
      <h2>PREVIEW</h2>
      <div class="preview" v-html="htmlString" />
      <v-style>{{ cssString }}</v-style>
    </div>
    <div>
      <h2>HTML</h2>
      <highlight-code lang="xml">
        {{ htmlString }}
      </highlight-code>
    </div>
    <div>
      <h2>SCSS</h2>
      <highlight-code lang="scss">
        {{ scssString }}
      </highlight-code>
    </div>
    <div>
      <h2>CSS</h2>
      <highlight-code lang="css">
        {{ cssString }}
      </highlight-code>
    </div>
    <div style="margin-top: 40px;">
      Math courtesy of
      <a href="http://css3.bradshawenterprises.com/cfimg/" target="_blank">
        http://css3.bradshawenterprises.com/cfimg/
      </a>
    </div>
  </div>
</template>

<script>
// From: http://css3.bradshawenterprises.com/cfimg/
// For "n" images You must define:
// a=presentation time for one image
// b=duration for cross fading
// Total animation-duration is of course t=(a+b)*n
// animation-delay = t/n or = a+b
// Percentage for keyframes:
// 0%
// a/t*100%
// (a+b)/t*100% = 1/n*100%
// 100%-(b/t*100%)
// 100%
export default {
  name: 'App',
  data() {
    return {
      duration: 5, // presentation time for one image (a)
      crossfade: 2, // duration for cross fading (b)
      totalImages: 2, // total number of images (n)
    };
  },
  computed: {
    // total animation-duration (t) = (a + b) * n
    totalDuration() {
      return (this.duration + this.crossfade) * this.totalImages;
    },
    // animation delay t / n OR a + b
    animationDelay() {
      return this.duration + this.crossfade;
    },
    // a / t * 100%
    percentFirst() {
      const calculation = this.duration / this.totalDuration;
      return Math.round(calculation * 100);
    },
    // (a + b) / t * 100% OR 1 / n * 100%
    percentMiddle() {
      const calculation = (this.duration + this.crossfade) / this.totalDuration;
      return Math.round(calculation * 100);
    },
    // 100% - (b / t * 100%)
    percentLast() {
      const calculation = this.crossfade / this.totalDuration;
      return 100 - Math.round(calculation * 100);
    },
    htmlString() {
      return `\n<div class="image-container">\n${this.htmlImages}</div>`;
    },
    htmlImages() {
      let images = '';
      for (let i = 1; i <= this.totalImages; i += 1) {
        images += `  <img src="//placehold.it/250x175?text=Image%20${i}">\n`;
      }
      return images;
    },
    scssString() {
      return `
.image-container {
  position: relative;
  
  img {
    position: absolute;
    animation-name: multiple-image-crossfade;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-duration: ${this.totalDuration}s;
${this.scssDelays}
  }
}
${this.cssKeyframes}
      `;
    },
    scssDelays() {
      let delays = '';
      for (let i = 1; i <= this.totalImages; i += 1) {
        delays += `    &:nth-of-type(${i}) {\n      animation-delay: ${this.calculateDelay(i)}s;\n    }\n`;
      }
      return delays;
    },
    cssString() {
      return `
.image-container {
  position: relative;
}

.image-container img {
  position: absolute;
  animation-name: multiple-image-crossfade;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: ${this.totalDuration}s;
}

${this.cssDelays}
${this.cssKeyframes}
      `;
    },
    cssDelays() {
      let delays = '';
      for (let i = 1; i <= this.totalImages; i += 1) {
        delays += `.image-container img:nth-of-type(${i}) {\n  animation-delay: ${this.calculateDelay(i)}s;\n}\n\n`;
      }
      return delays;
    },
    cssKeyframes() {
      return `
@keyframes multiple-image-crossfade {
  0% {
    opacity:1;
  }
  ${this.percentFirst}% {
    opacity:1;
  }
  ${this.percentMiddle}% {
    opacity:0;
  }
  ${this.percentLast}% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}      
      `;
    },
  },
  watch: {
    duration: {
      handler(newValue, oldValue) {
        if (newValue < 0.1) {
          this.duration = oldValue;
        }
      },
    },
    crossfade: {
      handler(newValue, oldValue) {
        if (newValue < 0.1) {
          this.crossfade = oldValue;
        }
      },
    },
    totalImages: {
      handler(newValue, oldValue) {
        if (newValue < 1) {
          this.totalImages = oldValue;
        } else {
          this.totalImages = Math.ceil(newValue);
        }
      },
    },
  },
  methods: {
    calculateDelay(i) {
      const calculation = this.totalDuration - i * (this.duration + this.crossfade);
      return Math.round(calculation * 10) / 10;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 60px;
}

h1, h2, h3 {
  margin: 0;
}

h2 {
  margin-top: 25px;
}

.form {
  margin-top: 25px;
}

.preview {
  min-width: 250px;
  min-height: 175px;
}
</style>
