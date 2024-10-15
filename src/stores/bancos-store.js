import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { ref } from "vue";

const RUTA_BANCOS = "/bancos";

export const useBancosStore = defineStore("bancosStore", () => {
  const bancos = ref([]);
  async function cargarBancos() {
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_BANCOS)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                bancos.value = response.data.ejecucion.datos.bancos;
                resolve();
              } else {
                reject(new Error(response.data.ejecucion.respuesta.mensaje));
              }
            })
            .catch((error) => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      });
      return p;
    } catch (error) {
      console.log("Error en el proceso:", error.message);
    }
  }

  return {
    cargarBancos,
    bancos,
  };
});
