// vuetify.d.ts

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vuetify/lib/framework" {
  import { Vuetify as _Vuetify } from "vuetify";
  export default _Vuetify;
}
