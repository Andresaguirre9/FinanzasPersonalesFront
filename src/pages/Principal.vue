<template>
  <q-page padding class="bg-section">
    <div class="q-pa-md text-h3 text-bold text-center text-primary">
      Bienvenido a tu Dashboard de Finanzas Personales
    </div>
    <div class="q-pa-sm text-h6 text-center text-secondary">
      Administra tus ingresos, gastos y ahorros en un solo lugar.
    </div>

    <q-card class="q-ma-md q-pa-md">
      <div class="q-pa-md text-h5 text-bold text-secondary bold">
        Seleccione su cuenta
      </div>
      <q-card-section>
        <div class="q-gutter-md">
          <q-select @update:model-value="consultarCuenta" rounded standout="bg-grey-5 text-black"
            v-model="cuentaSeleccionada" :options="cuentas" label="Seleccione tu cuenta" />
        </div>
      </q-card-section>

      <q-card-section class="bg-header text-header text-center q-pa-md">
        <div class="text-h4">Saldo Actual</div>
        <div class="text-h2 text-bold" v-if="cuentaConsultada">
          ${{ fixedNumber(cuentaConsultada.saldo_actual) }}
        </div>
        <div class="text-h2 text-bold" v-else>$ 0</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="bg-dark text-white row justify-between">
        <div class="col">
          <q-icon name="arrow_upward" class="q-mr-sm" />
          Ingresos
        </div>
        <div>

          ${{ fixedNumber(totales.ingresos) }}
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="bg-dark text-white row justify-between">
        <div class="col">
          <q-icon name="arrow_downward" class="q-mr-sm" />
          Gastos
        </div>
        <div>
          ${{ fixedNumber(totales.egresos) }}
        </div>
      </q-card-section>
    </q-card>

    <div class="q-pa-md row justify-center">
      <q-btn icon="account_balance_wallet" label="Ir a Cuentas" color="primary" size="lg" @click="goToCuentas" />
    </div>

    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h6">Seleccionar Fechas:</div>
        <q-input filled v-model="fechaInicio" label="Fecha Inicio" type="date" class="q-mb-md" />
        <q-input filled v-model="fechaFin" label="Fecha Fin" type="date" class="q-mb-md" />
        <q-btn label="Buscar" color="primary" @click="buscar" />
        <div v-if="mensajeValidacion" class="q-mt-md text-negative">
          {{ mensajeValidacion }}
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-pa-sm">
      <q-card-section class="row q-col-gutter-sm">
        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
          <line-chart />
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <pie-chart />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, defineComponent, onMounted, computed, defineAsyncComponent } from "vue";
import { useMovimientosStore } from "stores/movimientos-store.js";
import { useEstadisticasStore } from "stores/estadisticas-store";
import { useCuentasStore } from "stores/cuentas-store.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
defineComponent({
  name: "PrincipalPage",
});

const PieChart = defineAsyncComponent(() =>
  import('src/components/PieChart.vue')
)

const LineChart = defineAsyncComponent(() =>
  import('src/components/LineChart.vue')
)

const fechaInicio = ref("");
const fechaFin = ref("");
const mensajeValidacion = ref("");
const cuentasStore = useCuentasStore();
const movimientosStore = useMovimientosStore();
const estadisticasStore = useEstadisticasStore();
const router = useRouter();
const $q = useQuasar();
const cuentaSeleccionada = ref("");
const cuentaConsultada = ref(null);

async function consultarCuenta(option) {
  try {
    cuentaConsultada.value = await cuentasStore.consultarCuenta(option.value);
    if (cuentaConsultada.value) {
      await movimientosStore.totalizarIngresoEgreso(cuentaConsultada.value.id);
    }
  } catch (error) {
    console.log(error);
  }
}

const cuentas = computed({
  get() {
    return cuentasStore.cuentas;
  },
});
const totales = computed({
  get() {
    return movimientosStore.totales;
  },
});

const goToCuentas = () => {
  router.push("/main/cuentas");
};

onMounted(async () => {
  try {
    $q.loading.show({
      message: "Cargando Cuentas ...",
    });

    await cuentasStore.cargarCuentas();
  } catch (error) {
    if (error.message.includes("Network Error")) {
      $q.notify({
        progress: true,
        message:
          "Error de conexión con el servidor. Por favor, revisa tu conexión a internet.",
        icon: "error",
        color: "red",
        textColor: "white",
      });
    } else if (!error.response) {
      $q.notify({
        progress: true,
        message: "Error al momento de cargar los registros. ",
        icon: "error",
        color: "red",
        textColor: "white",
      });
    } else {
      $q.notify({
        progress: true,
        message: error.response.data.split("\n")[0],
        icon: "error",
        color: "red",
        textColor: "white",
      });
    }
  } finally {
    $q.loading.hide();
  }
});

function fixedNumber(number) {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(+number);
}

async function buscar() {

  try {
    $q.loading.show({
      message: "Cargando graficas ...",
    });

    if (!cuentaConsultada.value) {
      $q.notify({
        progress: true,
        message:
          "Debe seleccionar primero una cuenta",
        icon: "error",
        color: "red",
        textColor: "white",
      });
      return;
    }

    const filter = {
      fechaInicio: fechaInicio.value,
      fechaFin: fechaFin.value,
      idCuenta: cuentaConsultada.value.id
    }

    await estadisticasStore.calcularIngresosEgresos(filter)
    await estadisticasStore.calcularMovimientosMensuales(filter)
  } catch (error) {
    if (error.message.includes("Network Error")) {
      $q.notify({
        progress: true,
        message:
          "Error de conexión con el servidor. Por favor, revisa tu conexión a internet.",
        icon: "error",
        color: "red",
        textColor: "white",
      });
    } else if (!error.response) {
      $q.notify({
        progress: true,
        message: "Error al momento de cargar los registros. ",
        icon: "error",
        color: "red",
        textColor: "white",
      });
    } else {
      $q.notify({
        progress: true,
        message: error.response.data.split("\n")[0],
        icon: "error",
        color: "red",
        textColor: "white",
      });
    }
  } finally {
    $q.loading.hide();
  }

}
</script>

<style scoped>
.bg-header {
  background-color: #2c3e50;
}

.text-header {
  color: #ecf0f1;
}

.bg-section {
  background-color: #ecf0f1;
}

.bg-dark {
  background-color: #2c3e50;
}

.text-white {
  color: #ecf0f1;
}

.text-primary {
  color: #3498db;
}

.text-secondary {
  color: #95a5a6;
}

.text-negative {
  color: #e74c3c;
}

.text-center {
  text-align: center;
}
</style>
