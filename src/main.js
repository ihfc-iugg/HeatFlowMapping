// import "@babel/polyfill";
// import "mutationobserver-shim";

import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import { createPinia } from "pinia";

const app = createApp(App).use(createPinia());

app.mount(document.getElementsByClassName("whfd-mapping")[0]);
