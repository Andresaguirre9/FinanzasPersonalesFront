<template>
  <q-page class="flex flex-center bg-page">
    <div class="q-mt-md q-px-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section class="q-pa-none text-center">
          <h3 v-if="mostrarLogin">¿Aún no tienes una cuenta?</h3>
          <h3 v-else>¿Ya tienes una cuenta?</h3>
          <p v-if="mostrarLogin">Regístrate para que puedas iniciar sesión</p>
          <p v-else>Inicia sesión para entrar en la página</p>
          <q-btn color="primary" flat @click="toggleFormulario">
            {{ mostrarLogin ? "Regístrarse" : "Iniciar Sesión" }}
          </q-btn>
        </q-card-section>
      </q-card>

      <div class="q-mt-md">
        <transition name="slide-fade">
          <q-form
            v-show="mostrarLogin"
            @submit="onSubmit"
            class="q-pa-md"
            ref="formulario_login"
          >
            <q-card flat bordered class="q-pa-md">
              <q-card-section>
                <h2 class="text-center text-primary">Iniciar Sesión</h2>
                <q-input
                  v-model="usuario"
                  type="text"
                  placeholder="Correo Electrónico"
                  outlined
                  dense
                  class="q-mt-md"
                />
                <q-input
                  v-model="password"
                  type="password"
                  placeholder="Contraseña"
                  outlined
                  dense
                  class="q-mt-md"
                />
                <q-btn
                  type="submit"
                  color="primary"
                  label="Entrar"
                  class="q-mt-lg full-width"
                />
              </q-card-section>
            </q-card>
          </q-form>
        </transition>

        <transition name="slide-fade">
          <q-form
            v-show="!mostrarLogin"
            @submit="onRegister"
            class="q-pa-md"
            ref="formulario_register"
          >
            <q-card flat bordered class="q-pa-md">
              <q-card-section>
                <h2 class="text-center text-primary">Regístrarse</h2>
                <q-input
                  type="text"
                  placeholder="Usuario"
                  outlined
                  dense
                  class="q-mt-md"
                />
                <q-input
                  type="password"
                  placeholder="Contraseña"
                  outlined
                  dense
                  class="q-mt-md"
                />
                <q-btn
                  type="submit"
                  color="primary"
                  label="Regístrarse"
                  class="q-mt-lg full-width"
                />
              </q-card-section>
            </q-card>
          </q-form>
        </transition>
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
const password = ref("");
const mensaje = ref("");
const loading = ref(false);
const errorAutenticacion = ref(false);
const router = useRouter();
const form = ref(null);

const mostrarLogin = ref(true);

const toggleFormulario = () => {
  mostrarLogin.value = !mostrarLogin.value;
};

const onSubmit = () => {
  loading.value = true;

  $q.loading.show({
    backgroundColor: "#fff",
    message: "Ingresando a la aplicación ...",
    messageColor: "white",
  });

  autenticacionStore
    .doLogin({
      body: {
        usuario: usuario.value,
        password: password.value,
      },
      rememberMe: false,
    })
    .then((response) => {
      if (autenticacionStore.ejecucion.respuesta.estado === "NOK") {
        $q.notify({
          color: "white",
          message: autenticacionStore.ejecucion.respuesta.message,
          icon: "error",
          textColor: "red",
        });
      } else {
        usuario.value = null;
        form.value = null;
        password.value = null;
        router.push("/main");
        $q.notify({
          color: "white",
          message: "Inicio de sesión exitoso",
          icon: "check",
          textColor: "green",
        });
      }

      router.push("/main");
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 0) {
          $q.notify({
            color: "negative",
            position: "top",
            message: autenticacionStore.ejecucion.respuesta.message,
            icon: "error",
          });
          errorAutenticacion.value = true;
        }
      }
    })
    .finally(() => {
      $q.loading.hide();
      loading.value = false;
    });
};

const onRegister = () => {
  // Manejar registro
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
