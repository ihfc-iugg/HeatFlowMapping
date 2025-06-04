import { createApp } from 'vue'
import App from './App.vue'

import { Buffer } from 'buffer'

// import global css styles
import './assets/scss/bootstrap.scss'
import 'bootstrap/dist/js/bootstrap.js'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import { createPinia } from 'pinia'

const app = createApp(App).use(createPinia())

app.mount(document.getElementsByClassName('whfd-mapping')[0])

window.Buffer = window.Buffer || Buffer
