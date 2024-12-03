<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div v-if="submitt" id="chart">
          <apexchart type="area" height="392" :options="chartOptions" :series="series"></apexchart>
        </div>

        <div v-else class="q-gutter-y-md">
          <q-skeleton width="32vmax" height="19vmax" />
          <q-skeleton width="32vmax" height="5px" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { computed } from "vue";
import { useEstadisticasStore } from "stores/estadisticas-store";

export default {
  name: "GraficaMovientosMensuales",
  data() {
    const estadisticasStore = useEstadisticasStore();

    const submitt = computed(() => estadisticasStore.submittingLineChart);

    return {
      submitt,
      series: computed(() => estadisticasStore.lineChartSeries),
      categories: computed(() => estadisticasStore.lineChartCategories),
      chartOptions: computed(() => ({
        chart: {
          height: 350,
          type: "area",
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: estadisticasStore.lineChartCategories,
          labels: {
            rotate: -45,
            format: "MMM yyyy",
          },
          title: {
            text: "Meses",
          },
        },
        tooltip: {
          x: {
            format: "MMM yyyy",
          },
        },
      })),
    };
  },
};
</script>
