import { reactive, computed, ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";
import { axiosInstance } from "src/boot/axios";
import { Cookies } from "quasar";

const LOGIN_ROUTE = "/login";

export const useAuthStore = defineStore("autenticacion", () => {
  const ejecucionComputada = computed({
    get() {
      return ejecucion.value;
    },
  });
  const ejecucion = ref(null);

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
  return {
    doLogin,
    setHeader,
    ejecucion,
  };
});
