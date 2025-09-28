// main.js
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import VueApexCharts from "vue3-apexcharts";
import "./assets/css/style.css";

import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Password from "primevue/password";
import Tag from "primevue/tag";

const app = createApp(App);

app.component("Menubar", Menubar);
app.component("Button", Button);
app.component("Card", Card);
app.component("Divider", Divider);
app.component("Avatar", Avatar);
app.component("Tag", Tag);
app.component("Menu", Menu);
app.component("InputText", InputText);
app.component("Password", Password);
app.component("Checkbox", Checkbox);

app.use(router);
app.use(createPinia());

const MyAuraBlue = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#e6f5fb",
      100: "#bfe4f5",
      200: "#99d2ee",
      300: "#66bfea",
      400: "#40afe5",
      500: "#33A1E0", // <- warna utama yang kamu mau
      600: "#2b8ec6",
      700: "#2374a3",
      800: "#1a5b80",
      900: "#12425d",
      950: "#0a2939",
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: MyAuraBlue,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
  ripple: true,
});

app.use(VueApexCharts);
app.mount("#app");
