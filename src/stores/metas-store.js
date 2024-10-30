import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { ref } from "vue";

const RUTA_METAS = "/metas";
const RUTA_META_CONSULTA = "/metas/consultar";
const RUTA_META_AGREGAR = "/metas/agregar";
const RUTA_META_ACTUALIZAR = "/metas/actualizar";
const RUTA_Cargar_Metas = "/metas/cargar";

export const useMetasStore = defineStore("metasStore", () => {
  const paginationOriginal = ref({
    sortBy: "nombre_meta",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    limite: 10,
  });

  const pagination = ref({
    sortBy: "nombre_meta",
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

  const metas = ref([]);
  async function cargarMetas() {
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_Cargar_Metas)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                metas.value = response.data.ejecucion.datos.metas;
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

  async function listarMetas(original) {
    const params = {
      params: {
        pagination: original ? paginationOriginal.value : pagination.value,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_METAS, params)
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

  async function consultarMeta(idMeta) {
    const params = {
      params: {
        idMeta: idMeta,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_META_CONSULTA, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                resolve(response.data.ejecucion.datos.meta);
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

  async function agregarMeta(datosMeta) {
    const params = {
      datosMeta,
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .post(RUTA_META_AGREGAR, params)
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

  async function actualizarMeta(datosMeta) {
    const params = {
      datosMeta,
    };

    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .put(RUTA_META_ACTUALIZAR, params)
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
    actualizarMeta,
    consultarMeta,
    cargarMetas,
    agregarMeta,
    listarMetas,
    pagination,
    records,
    metas,
  };
});
