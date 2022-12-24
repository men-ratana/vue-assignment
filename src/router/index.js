import { createRouter, createWebHashHistory } from "vue-router";
import DashboardLayout from "@/layout/DashboardLayout";
import Dashboard from "../views/Dashboard.vue";
import Countries from "../views/Countries/Countries.vue";
import CountriesTable from "../views/Countries/CountriesTable.vue";
import Profile from "../views/UserProfile.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        components: { default: Dashboard },
      },
      {
        path: "/countries",
        name: "Countries",
        components: { default: Countries },
        children: [
          { path: "", name: "countries-table", component: CountriesTable },
        ],
      },
      {
        path: "/profile",
        name: "profile",
        components: { default: Profile },
      },
    ],
  },
  // {
  //   path: "/",
  //   redirect: "login",
  //   component: AuthLayout,
  //   children: [
  //     {
  //       path: "/login",
  //       name: "login",
  //       components: { default: Login },
  //     },
  //     {
  //       path: "/register",
  //       name: "register",
  //       components: { default: Register },
  //     },
  //   ],
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  routes,
});

export default router;
