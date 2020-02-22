import Vue from 'vue';
import VueHighlightJS from 'vue-highlight.js';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/agate.css';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueHighlightJS, {
  languages: { css, scss, xml },
});

Vue.component('v-style', {
  render(createElement) {
    return createElement('style', this.$slots.default);
  },
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
