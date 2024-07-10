import { createApp } from 'vue'
import App from './App.vue'

// import global css styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import { createPinia } from 'pinia'

const app = createApp(App).use(createPinia())

app.mount(document.getElementsByClassName('whfd-mapping')[0])
