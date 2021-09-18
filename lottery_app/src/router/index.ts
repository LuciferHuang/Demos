import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/index.vue')
  }
];

export default function createRouter() {
  return new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
  });
}