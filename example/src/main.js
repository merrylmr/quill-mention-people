import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)
new Vue({
  render: h => h(App),
}).$mount('#app')
