<template>
  <q-page class="flex flex-center bg-page">
    <div class="q-mt-md q-px-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section class="q-pa-none text-center">
          <h3>Recuperación de contraseña</h3>
        </q-card-section>
      </q-card>

      <div class="q-mt-md">
        <q-form @submit="onSubmit" class="q-pa-md" ref="forgot">
          <q-card flat bordered class="q-pa-md">
            <q-card-section>
              <h2 class="text-center text-primary">Información del usuario</h2>
              <q-input
                v-model="usuario"
                type="email"
                placeholder="Usuario"
                outlined
                dense
                class="q-mt-md"
              />
              <q-input
                v-model="password"
                type="password"
                placeholder="Nueva contraseña"
                outlined
                dense
                class="q-mt-md"
              />
              <q-input
                v-model="passwordVerify"
                type="password"
                placeholder="Confirme su contraseña"
                outlined
                :rules="[
                  (val) => val !== '' || 'Campo requerido',
                  (val) => val === password || 'Las contraseñas no coinciden',
                ]"
                dense
                class="q-mt-md"
              />

              <q-btn
                type="submit"
                color="primary"
                label="Cambiar contraseña"
                class="q-mt-lg full-width"
              />
            </q-card-section>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/auth";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const $q = useQuasar();
const autenticacionStore = useAuthStore();
const usuario = ref("");
const loading = ref(false);
const router = useRouter();
const form = ref(null);
const password = ref(null);
const passwordVerify = ref(null);
const tokenreset = route.params.tokenreset;

const onSubmit = () => {
  loading.value = true;
console.log('linea 77')
  $q.loading.show({
    backgroundColor: "#fff",
    message: "Cambiando contraseña",
    messageColor: "white",
  });

  autenticacionStore
    .resetPassword(usuario.value, password.value, tokenreset)
    .then((response) => {
console.log('linea 86')

      router.replace("/");
    })
    .catch((error) => {
console.log('linea 89 90')

      if (error.response) {
        if (error.response.status === 0) {
          $q.notify({
            color: "white",
            message:
              "En este momento no es posible conectarse con el servidor por favor comuniquese con el administrador",
            icon: "warning",
            textColor: "orange-13",
          });
        }
      }
    })
    .finally(() => {
      form.value = null;
      $q.loading.hide();
      loading.value = false;
    });
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10%);
}
</style>
