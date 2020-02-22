<template>
  <div id="app">
    <section class="header">
      <h1>CSS Crossfade Calculator</h1>
      <div class="github-link">
        <a href="https://github.com/adambergman/css-crossfade-calculator">
          View on Github
        </a>
        <a href="https://github.com/adambergman/css-crossfade-calculator">
          <img src="./assets/github-mark.png" class="github-mark">
        </a>
      </div>
    </section>
    <div class="form-container">
      <section class="form">
        <h2>SETTINGS</h2>
        <div class="form-item">
          <label for="duration">Duration of image display</label>
          <div class="input">
            <input v-model.number="duration" name="duration" id="duration" type="number" />
            seconds
          </div>
        </div>
        <div class="form-item">
          <label for="crossfade">Cross fade duration</label>
          <div class="input">
            <input v-model.number="crossfade" type="number" name="crossfade" id="crossfade" />
            seconds
          </div>
        </div>
        <div class="form-item">
          <label for="total">Total Images</label>
          <div class="input">
            <input v-model.number="totalImages" name="total" id="total" type="number" />
          </div>
        </div>
      </section>
      <section class="preview">
        <h2>PREVIEW</h2>
        <div class="preview-images" v-html="htmlString" />
        <v-style>{{ cssString }}</v-style>
      </section>
    </div>
    <section class="code">
      <div class="code-html">
        <h2>HTML</h2>
        <highlight-code lang="xml">
          {{ htmlString }}
        </highlight-code>
      </div>
      <div class="styles">
        <div class="code-css">
          <h2>CSS</h2>
          <highlight-code lang="css">
            {{ cssString }}
          </highlight-code>
        </div>
        <div class="code-scss">
          <h2>SCSS</h2>
          <highlight-code lang="scss">
            {{ scssString }}
          </highlight-code>
        </div>
      </div>
    </section>
    <section class="credits" style="margin-top: 40px;">
      Approach and Algorithm courtesy of
      <a href="http://css3.bradshawenterprises.com/cfimg/" target="_blank">
        http://css3.bradshawenterprises.com/cfimg/
      </a>
    </section>
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
        images += `  <img src="//placehold.it/250x200?text=Image%20${i}">\n`;
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
  padding: 10px 60px 60px;
  @media(max-width: 767px) {
    padding: 10px 30px 60px;
  }
}

a {
  color: #2c3e50;
  &:hover {
    color: #226666;
  }
}

h1, h2, h3 {
  margin: 0;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #dadada;
  .github-link {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    .github-mark {
      width: 20px;
      margin-left: 5px;
      margin-top: 5px;
      border: none;
    }
  }
  @media(max-width: 650px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.form-container {
  padding: 20px 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dadada;
  .preview {
    width: 50%;
  }
  .form {
    width: 50%;
    padding-right: 40px;
    .form-item {
      display: flex;
      flex-direction: column;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #dadada;
      label {
        font-size: 14px;
        color: rgba(44, 62, 80, 0.7);
        padding-bottom: 5px;
      }
      .input {
        font-size: 16px;
        input {
          font-size: 18px;
          padding: 5px;
          max-width: 50px;
          text-align: center;
        }
      }
      @media(min-width: 651px) {
        &:last-child {
          border-bottom: none;
          padding-bottom: 0px;
          margin-bottom: 0px;
        }
      }
    }
  }
  .preview-images {
    min-width: 250px;
    min-height: 200px;
  }
  @media(max-width: 650px) {
    flex-direction: column;
    align-items: flex-start;
    .form, .preview {
      width: 100%;
      padding-bottom: 20px;
      padding-right: 0px;
    }
  }
}

.code {
  .code-html {
    padding: 20px 0px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #dadada;
  }
  .styles {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px 0px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #dadada;
    .code-css, .code-scss {
      width: 50%;
    }
    .code-css {
      margin-right: 10px;
    }
    .code-scss {
      margin-left: 10px;
    }
    @media(max-width: 650px) {
      flex-direction: column;
      align-items: flex-start;
      .code-css, .code-scss {
        width: 100%;
        margin-left: 0px;
        margin-right: 0px;
      }
    }
  }
}
</style>
