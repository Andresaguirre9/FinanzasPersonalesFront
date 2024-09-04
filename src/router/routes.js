const routes = [
  {
    path: "/main",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "principal",
        component: () => import("pages/Principal.vue"),
      },
      {
        path: "cuentas",
        component: () => import("pages/Cuentas.vue"),
      },
      {
        path: "",
        redirect: "/main/principal",
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/UserLogin.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
