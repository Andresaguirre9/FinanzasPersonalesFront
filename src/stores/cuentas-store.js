import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { ref } from "vue";

const RUTA_CUENTAS = "/cuentas";
const RUTA_CUENTA_CONSULTA = "/cuentas/consultar";
const RUTA_CUENTA_AGREGAR = "/cuentas/agregar";
const RUTA_CUENTA_REPORTE = "/cuentas/enviarreporte";
const RUTA_CUENTA_ACTUALIZAR = "/cuentas/actualizar";
const RUTA_Cargar_Cuentas = "/cuentas/cargar";

export const useCuentasStore = defineStore("cuentasStore", () => {
  const paginationOriginal = ref({
    sortBy: "nombre_cuenta",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const pagination = ref({
    sortBy: "nombre_cuenta",
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

  const cuentas = ref([]);
  async function cargarCuentas() {
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_Cargar_Cuentas)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                cuentas.value = response.data.ejecucion.datos.cuentas;
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

  async function listarCuentas(original) {
    const params = {
      params: {
        pagination: original ? paginationOriginal.value : pagination.value,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_CUENTAS, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                records.value = response.data.ejecucion.datos.records;
                pagination.value = response.data.ejecucion.datos.pagination;
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

  async function consultarCuenta(idCuenta) {
    const params = {
      params: {
        idCuenta: idCuenta,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_CUENTA_CONSULTA, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                resolve(response.data.ejecucion.datos.cuenta);
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

  async function agregarCuenta(datosCuenta) {
    const params = {
      datosCuenta,
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .post(RUTA_CUENTA_AGREGAR, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                resolve(response.data.ejecucion.datos);
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
  async function enviarReporte(idCuenta) {
    const params = {
      idCuenta,
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .post(RUTA_CUENTA_REPORTE, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
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

  async function actualizarCuenta(datosCuenta) {
    const params = {
      datosCuenta,
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .put(RUTA_CUENTA_ACTUALIZAR, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                resolve(response.data.ejecucion.datos);
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
    paginationOriginal,
    actualizarCuenta,
    consultarCuenta,
    cargarCuentas,
    enviarReporte,
    agregarCuenta,
    listarCuentas,
    pagination,
    records,
    cuentas,
  };
});
