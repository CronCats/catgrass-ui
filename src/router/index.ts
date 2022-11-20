import { createRouter, createWebHistory } from "vue-router";
import NotFound from "../views/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
    { path: "/", name: "home", component: () => import("../views/Home.vue") },
    {
      path: "/explore",
      name: "explore",
      component: () => import("../views/Explore.vue"),
    },
    {
      path: "/create",
      name: "create",
      component: () => import("../views/Create.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/Profile.vue"),
      children: [
        {
          path: "accounts",
          component: () => import("../views/ProfileAccounts.vue"),
        },
        {
          path: "recipes",
          component: () => import("../views/ProfileRecipes.vue"),
        },
        {
          path: "settings",
          component: () => import("../views/ProfileSettings.vue"),
        },
      ],
    },
  ],
});

export default router;
