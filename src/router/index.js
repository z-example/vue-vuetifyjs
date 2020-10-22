import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Table from "../views/Table.vue";
import Form from "../views/Form.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/table",
    name: "Table",
    component: Table
  },
  {
    path: "/form",
    name: "Form",
    component: Form
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
