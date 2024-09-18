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
                type="text"
                placeholder="Correo Electrónico"
                outlined
                dense
                class="q-mt-md"
              />
              <q-btn
                type="submit"
                color="primary"
                label="Recuperar contraseña"
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
import { useRouter } from "vue-router";

const $q = useQuasar();
const autenticacionStore = useAuthStore();
const usuario = ref("");
const loading = ref(false);
const router = useRouter();
const form = ref(null);

const onSubmit = () => {
  loading.value = true;

  $q.loading.show({
    backgroundColor: "#fff",
    message:
      "Se enviará un correo si usted cuenta con un usuario en la aplicación",
    messageColor: "white",
  });

  autenticacionStore
    .forgot(usuario.value)
    .then((response) => {
      router.replace("/");
    })
    .catch((error) => {
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
      usuario.value = null;
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
