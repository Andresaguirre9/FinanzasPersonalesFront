import { reactive, computed, ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";
import { axiosInstance } from "src/boot/axios";
import { Cookies } from "quasar";

const LOGIN_ROUTE = "/login";
const FETCH_USER_ROUTE = "/fetch";
const singUp_route = "/signup";

export const useAuthStore = defineStore("autenticacion", () => {
  const ejecucionComputada = computed({
    get() {
      return ejecucion.value;
    },
  });
  const ejecucion = ref(null);

  const loggedIn = () => {
    return ejecucion.value !== null;
  };
  const id = ref(0);
  const email = ref("");
  const loginCallbacks = [];

  const setHeader = (data) => {
    axiosInstance.defaults.headers.common.Authorization =
      "Bearer " + data.token;
    if (data.rememberMe) {
      Cookies.set("authorization_token", data.token, {
        expires: 365,
      });
    } else {
      Cookies.set("authorization_token", data.token);
    }
  };

  const doLogin = async (data) => {
    const p = new Promise(function (resolve, reject) {
      return axiosInstance
        .post(LOGIN_ROUTE, data.body)
        .then((response) => {
          ejecucion.value = response.data.ejecucion;
          if (response.data.ejecucion.respuesta.estado === "OK") {
            setHeader({
              token: ejecucion.value.datos.token,
              rememberMe: false,
            });
            resolve();
          } else {
            reject(new Error(response.data.ejecucion.respuesta.message));
          }
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
    return p;
  };

  const signUp = async (data) => {
    const p = new Promise(function (resolve, reject) {
      return axiosInstance
        .post(singUp_route, data.body)
        .then((response) => {
          ejecucion.value = response.data.ejecucion;
          if (response.data.ejecucion.respuesta.estado === "OK") {
            resolve();
          } else {
            reject(new Error(response.data.ejecucion.respuesta.message));
          }
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
    return p;
  };

  const fetch = async () => {
    const token = Cookies.get("authorization_token");
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = "Bearer " + token;
    }

    if (axiosInstance.defaults.headers.common.Authorization) {
      return axiosInstance
        .get(FETCH_USER_ROUTE)
        .then((response) => {
          ejecucion.value = response.data.ejecucion;
          id.value = ejecucionComputada.value.datos.user.data.id;
          email.value = ejecucionComputada.value.datos.user.data.email;
        })
        .then(() => {
          loginCallback();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return new Promise((resolve, reject) => {
        reject("No authorization token found");
      });
    }
  };

  const loginCallback = (data = {}) => {
    for (const loginCallback of loginCallbacks) {
      loginCallback({ router: data.router });
    }
  };

  return {
    doLogin,
    setHeader,
    ejecucion,
    loggedIn,
    fetch,
    loginCallback,
    id,
    email,
    loginCallbacks,
    signUp,
  };
});
