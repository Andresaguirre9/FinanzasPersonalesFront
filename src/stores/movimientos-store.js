import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { ref } from "vue";

const RUTA_MOVIMIENTOS = "/movimientos";
const RUTA_MOVIMIENTO_CONSULTA = "/movimientos/consultar";
const RUTA_MOVIMIENTO_AGREGAR = "/movimientos/agregar";

export const useMovimientosStore = defineStore("movimientosStore", () => {
  const paginationOriginal = ref({
    sortBy: "fecha_movimiento",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const pagination = ref({
    sortBy: "fecha_movimiento",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const records = ref({
    data: [],
    dataExportar: [],
  });

  async function listarMovimientos(original, idCuenta) {
    const params = {
      params: {
        idCuenta: idCuenta,
        pagination: original ? paginationOriginal.value : pagination.value,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_MOVIMIENTOS, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                records.value = response.data.ejecucion.datos.records;
                pagination.value = response.data.ejecucion.datos.pagination;
                resolve();
              } else {
                reject(new Error(response.data.ejecucion.respuesta.message));
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

  async function consultarMovimiento(idMovimiento) {
    const params = {
      params: {
        idMovimiento: idMovimiento,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_MOVIMIENTO_CONSULTA, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                resolve(response.data.ejecucion.datos.movimiento);
              } else {
                reject(new Error(response.data.ejecucion.respuesta.message));
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

  async function agregarMovimiento(datosMovimiento) {
    const params = {
      datosMovimiento,
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .post(RUTA_MOVIMIENTO_AGREGAR, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                resolve(response.data.ejecucion);
              } else {
                reject(response.data.ejecucion.respuesta.message);
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
    paginationOriginal,
    consultarMovimiento,
    agregarMovimiento,
    listarMovimientos,
    pagination,
    records,
  };
});
