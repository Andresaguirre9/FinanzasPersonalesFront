import { defineStore } from "pinia";
import { axiosInstance } from "../boot/axios";
import { ref } from "vue";

const RUTA_PIE_CHART = "/calcular-ingresos-egresos";
const RUTA_LINE_CHART = "/calcular-movimientos-mensuales";

export const useEstadisticasStore = defineStore("estadisticasStore", () => {
  const pieChartSeries = ref([]);
  const lineChartSeries = ref([]);
  const lineChartCategories = ref([]);
  const submittingPieChart = ref(false);
  const submittingLineChart = ref(false);

  async function calcularIngresosEgresos(filter) {
    const params = {
      params: {
        filter,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_PIE_CHART, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                submittingPieChart.value = true;
                console.log(
                  "las serieees 2",
                  response.data.ejecucion.datos.series
                );
                pieChartSeries.value = response.data.ejecucion.datos.series;
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

  async function calcularMovimientosMensuales(filter) {
    const params = {
      params: {
        filter,
      },
    };
    try {
      const p = new Promise(async function (resolve, reject) {
        try {
          await axiosInstance
            .get(RUTA_LINE_CHART, params)
            .then((response) => {
              if (response.data.ejecucion.respuesta.estado === "OK") {
                submittingLineChart.value = true;
                console.log(
                  "las serieees",
                  response.data.ejecucion.datos.series
                );
                lineChartSeries.value = response.data.ejecucion.datos.series;
                lineChartCategories.value =
                  response.data.ejecucion.datos.categories;
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
    calcularMovimientosMensuales,
    calcularIngresosEgresos,
    submittingLineChart,
    lineChartCategories,
    submittingPieChart,
    lineChartSeries,
    pieChartSeries,
  };
});
