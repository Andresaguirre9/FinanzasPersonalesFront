<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Finanzas personales
        </q-toolbar-title>

        <!-- Botón de Logout a la derecha -->
        <q-btn
          flat
          dense
          icon="logout"
          label="Logout"
          color="white"
          @click="logout"
        />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="principal" label="Inicio" />
        <q-route-tab to="cuentas" label="Cuentas" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from "stores/auth.js";
import { useRouter } from "vue-router";
import { useQuasar, Cookies } from "quasar";
import { onMounted } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

onMounted(async () => {
  router.beforeEach(async (to, from, next) => {
    const isAuthenticated = !!Cookies.get("authorization_token");
    if (to.fullPath === "/") {
      await authStore.logout();
    }
    if (to.meta.requiresAuth && !isAuthenticated) {
      next("/");
    } else {
      next();
    }
  });
});

function logout() {
  $q.dialog({
    title: "Cierre de sesión",
    message: "Usted esta saliendo de la aplicación",
    ok: "Continuar",
    cancel: "Cancelar",
  })
    .onOk(() => {
      authStore.logout();
      router.push("/");
    })
    .onCancel(() => {
      router.currentRoute;
    });
}
</script>
