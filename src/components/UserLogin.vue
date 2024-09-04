<template>
  <q-page class="flex flex-center bg-page">
    <div class="contenedor__todo q-mt-md q-px-md">
      <q-card flat bordered class="caja__trasera q-pa-md">
        <q-card-section
          class="q-pa-none caja__trasera-login"
          ref="caja_trasera_login"
        >
          <div class="text-center">
            <h3>¿Ya tienes una cuenta?</h3>
            <p>Inicia sesión para entrar en la página</p>
            <q-btn color="primary" flat @click="iniciarSesion"
              >Iniciar Sesión</q-btn
            >
          </div>
        </q-card-section>
        <q-card-section
          class="q-pa-none caja__trasera-register"
          ref="caja_trasera_register"
        >
          <div class="text-center">
            <h3>¿Aún no tienes una cuenta?</h3>
            <p>Regístrate para que puedas iniciar sesión</p>
            <q-btn color="primary" flat @click="register">Regístrarse</q-btn>
          </div>
        </q-card-section>
      </q-card>

      <div
        class="contenedor__login-register q-mt-md"
        ref="contenedor_login_register"
      >
        <q-form
          @submit="onSubmit"
          class="formulario__login q-pa-md"
          ref="form"
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

        <!-- Register -->
        <q-form
          @submit="onRegister"
          class="formulario__register q-pa-md"
          ref="formulario_register"
        >
          <q-card flat bordered class="q-pa-md">
            <q-card-section>
              <h2 class="text-center text-primary">Regístrarse</h2>
              <q-input
                type="text"
                placeholder="Nombre completo"
                outlined
                dense
                class="q-mt-md"
              />
              <q-input
                type="text"
                placeholder="Correo Electrónico"
                outlined
                dense
                class="q-mt-md"
              />
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
const form = ref('');

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
        console.log(
          "Error en la autenticacion",
          autenticacionStore.ejecucion.respuesta.message
        );
      } else {
        usuario.value = null;
        form.value = null;
        password.value = null;
        router.push("/main");
      }

      router.push("/main");
    })
    .catch((error) => {

      if (error.response) {
        if (error.response.status === 0) {
          mensaje.value =
            "En este momento no es posible conectarse con el servidor por favor comuníquese con el administrador";
          errorAutenticacion.value = true;
        }
      }
    })
    .finally(() => {

      $q.loading.hide();
      loading.value = false;
    });
};
</script>
<style scoped>
.bg-page {
  background-image: url("src/assets/images/bg4.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
}

.caja__trasera {
  display: flex;
  justify-content: center;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 128, 255, 0.7); /* Aumenta la opacidad para mejorar la legibilidad */
  border-radius: 15px; /* Bordes redondeados para un aspecto más moderno */
  padding: 20px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Sombra para destacar la caja */
}

.caja__trasera h3 {
  font-weight: 500;
  font-size: 28px;
  color: #fff;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); /* Sombra para mejorar la legibilidad */
}

.caja__trasera p {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 300;
  color: white;
}

.caja__trasera .q-btn {
  margin-top: 20px;
  color: white;
  border: 2px solid #fff;
  transition: all 0.3s ease; /* Transición suave en hover */
}

.caja__trasera .q-btn:hover {
  background: #fff;
  color: #46a2fd;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Sombra en hover */
}

.contenedor__todo {
  width: 100%;
  max-width: 800px;
  margin: auto;
  position: relative;
  padding: 20px; /* Añade padding para que los elementos no toquen los bordes */
}

.contenedor__login-register {
  display: flex;
  align-items: center;
  max-width: 380px;
  margin: auto;
  position: relative;
  transition: all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Transición suave */
}

.formulario__login {
  opacity: 1;
  display: block;
  transition: opacity 0.5s ease; /* Transición suave en la opacidad */
}

.formulario__register {
  display: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.formulario__register.active {
  display: block;
  opacity: 1;
}

@media screen and (max-width: 850px) {
  .contenedor__todo {
    max-width: 350px;
  }

  .caja__trasera {
    flex-direction: column;
    align-items: center;
  }

  .contenedor__login-register {
    top: -10px;
    left: -5px;
    margin: auto;
  }
}
</style>
