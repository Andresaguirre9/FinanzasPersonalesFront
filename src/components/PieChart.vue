<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div id="chart">
          <apexchart v-if="submitt" height="407" type="donut" :options="options" :series="series"></apexchart>
          <div class="row" v-else>
            <div>
              <q-skeleton type="circle" size="20vmax" />
            </div>
            <div class="q-gutter-y-md">
              <q-skeleton width="5vmax" height="5px" />
              <q-skeleton width="5vmax" height="5px" />
            </div>

          </div>

        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { computed } from "vue";
import { useEstadisticasStore } from "stores/estadisticas-store";

export default {
  name: 'GraficaIngresosEgresos',
  data() {
    const estadisticasStore = useEstadisticasStore();
    const submitt = computed(
      () => estadisticasStore.submittingPieChart
    )

    return {
      submitt,
      series: computed(
        () => estadisticasStore.pieChartSeries
      ),
      options: {
        chart: {
          width: 380,
          type: 'donut',
        },
        markers: {
          size: 2,
          hover: {
            sizeOffset: 2
          }
        },
        labels: ['Ingresos',
          'Egresos'],
        categories: ['Ingresos',
          'Egresos',],
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
            donut: {
              size: '67%',
              background: 'transparent',
              labels: {
                total: {
                  show: true,
                  showAlways: true,
                  label: 'Total',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#373d3f'
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: true
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter: function (val, opts) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex]
          }
        },

      },
    }
  }
}

</script>
