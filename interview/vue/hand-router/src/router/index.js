import { createRouter, createWebHistory } from "./grouter/index";

import Home from "../pages/Home.vue";
import About from "../pages/About.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
