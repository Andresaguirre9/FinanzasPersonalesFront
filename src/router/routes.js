// src/router/routes.js

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'principal', component: () => import('pages/Principal.vue') },
      { path: 'cuentas', component: () => import('pages/Cuentas.vue') },
      { path: '', redirect: '/principal' }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
