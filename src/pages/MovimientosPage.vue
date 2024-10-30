<template>
  <q-dialog v-model="nuevoMovimiento" persistent>
    <q-card>
      <q-toolbar>
        <q-avatar square>
          <q-icon name="trending_up" />
        </q-avatar>
        <q-item-section>
          <div class="text-grey-14 text-weight-bolder">Nuevo Movimiento</div>
        </q-item-section>
      </q-toolbar>

      <q-separator />

      <q-form @submit="confirmarMovimiento" @reset="limpiarFormulario" class="q-gutter-md">
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-input outlined v-model="descripcionMovimiento" label="Descripción"
                :rules="[(val) => val !== '' || 'Este campo es obligatorio']" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-input outlined v-model="montoMovimiento" prefix="$" mask="### ### ### ### ### ### ### ### ### ###"
                label="Monto" :rules="[(val) => val > 0 || 'Ingrese un valor correcto']" reverse-fill-mask
                unmasked-value />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-select outlined v-model="tipoMovimiento" :options="optionsTipoMovimiento" label="Tipo"
                :rules="[(val) => !!val || 'Seleccione un tipo']" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-input outlined v-model="fechaMovimiento" type="date" label="Fecha del Movimiento"
                :rules="[(val) => !!val || 'Seleccione una fecha']" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-select outlined v-model="categoriaMovimiento" :options="optionsCategoria"
                label="Categoría de Transacción" :rules="[(val) => !!val || 'Seleccione una categoría']" />
            </div>
          </div>
        </q-card-section>

        <div class="q-card-actions row justify-center q-gutter-sm q-pa-sm">
          <q-btn label="Confirmar" color="primary" type="submit" />
          <q-btn label="Cancelar" color="primary" type="reset" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- DIALOG DE SELCCION DE CUENTA INICIO -->
  <q-dialog v-model="seleccionarCuenta" persistent>
    <q-card style="width: 40vmax;">
      <q-toolbar>
        <q-avatar square>
          <q-icon name="wallet" />
        </q-avatar>
        <q-item-section>
          <div class="text-grey-14 text-weight-bolder">Seleccion de cuenta</div>
        </q-item-section>
      </q-toolbar>

      <q-separator />

      <q-form @submit="confirmarSeleccion" class="q-gutter-md">
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select outlined v-model="cuentaMovimiento" :options="optionsCuentas" label="Cuenta"
                :rules="[(val) => !!val || 'Seleccione una cuenta']" />
            </div>
          </div>
        </q-card-section>

        <div class="q-card-actions row justify-center q-gutter-sm q-pa-sm">
          <q-btn label="Confirmar" color="primary" type="submit" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
  <!-- DIALOG DE SELCCION DE CUENTA FIN -->

  <q-page padding class="bg-section-alt">
    <div class="text-center text-h3 text-main q-mb-lg">Movimientos</div>
    <div v-if="cuentaSeleccionada">

      <q-table class="bg-dark text-white" @request="ordenarPor" :rows="movimientos" :hide-header="mode === 'grid'"
        :columns="columnsMovimientos" row-key="id" :grid="mode == 'grid'" :loading="loading" binary-state-sort
        :rows-per-page-options="[0]" hide-pagination v-model:pagination="initialPagination"
        no-data-label="No se encontraron datos" no-results-label="El filtro no encontró ningún resultado">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <div class="text-weight-bold">
                {{ col.label }}
              </div>
            </q-th>
            <q-th>Acciones</q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" v-if="!loading">
            <q-td key="descripcion" :props="props">
              {{ props.row.descripcion }}
            </q-td>
            <q-td key="valor_movimiento" :props="props">
              {{ fixedNumber(props.row.valor_movimiento) }}
            </q-td>
            <q-td key="tipo_movimiento" :props="props">
              {{ props.row.tipo_movimiento }}
            </q-td>
            <q-td key="fecha_movimiento" :props="props">
              {{ props.row.fecha_movimiento }}
            </q-td>
            <q-td key="id_cuenta" :props="props">
              {{ props.row.id_cuenta.nombre_cuenta }}
            </q-td>
            <q-td key="categoria_transaccion" :props="props">
              {{ props.row.categoria_transaccion }}
            </q-td>

            <q-td auto-width>
              <div class="row q-pr-md">
                <div class="col q-pl-md">
                  <q-btn @click="editarCuenta(JSON.stringify(props.row.id))" flat bordered class size="10px" round
                    color="transparent" text-color="primary" icon="edit">
                    <q-tooltip class="bg-grey-6">Editar cuenta</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-td>
          </q-tr>
          <q-tr v-else>
            <q-td v-for="col in columns" :key="col.name">
              <q-skeleton width="5vmax" height="5px" />
            </q-td>
          </q-tr>
        </template>

        <template v-slot:top-right>
          <div class="row q-col-gutter-md">
            <div>
              <q-btn label="Agregar Movimiento" color="primary" @click="agregarNuevoMovimiento" />
            </div>
            <div>
              <q-btn @click="seleccionarNuevaCuenta()" color="primary" label="Seleccionar otra cuenta"
                text-color="white" />
            </div>
          </div>
        </template>
        <template v-slot:top-left>
          <q-toolbar>
            <q-avatar square icon="account" font-size="30px"> </q-avatar>

            <q-toolbar-title><span class="text-weight-bold">Cuentas</span></q-toolbar-title>
          </q-toolbar>
        </template>

        <template v-slot:bottom>
          <div class="full-width row flex-center text-accent q-gutter-sm">
            <q-pagination v-if="localPagination.rowsNumber > 0" v-model="currentPage" :max="maxPage" :max-pages="6"
              boundary-numbers @update:modelValue="onRequest" />
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCuentasStore } from "stores/cuentas-store.js";
import { useMovimientosStore } from "stores/movimientos-store.js";
import { useQuasar } from "quasar";

const nuevoMovimiento = ref(false);
const seleccionarCuenta = ref(false);
const loading = ref(false);
const cuentaSeleccionada = ref(false);
const descripcionMovimiento = ref("");
const montoMovimiento = ref(null);
const tipoMovimiento = ref("");
const fechaMovimiento = ref(null);
const $q = useQuasar();

const cuentaMovimiento = ref(null);
const categoriaMovimiento = ref("");
const cuentasStore = useCuentasStore();
const movimientosStore = useMovimientosStore();


const localPagination = computed({
  get() {
    return cuentasStore.pagination;
  },
});

const maxPage = computed(() =>
  Math.ceil(
    movimientosStore.pagination.rowsNumber / movimientosStore.pagination.rowsPerPage
  )
);

const currentPage = computed({
  get() {
    return +movimientosStore.pagination.page;
  },
  async set(pageNumber) {
    movimientosStore.pagination.page = pageNumber;
  },
});

const mode = ref("list");
const isLoading = ref(false);

const initialPagination = ref({
  sortBy: "fecha_movimiento",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

onMounted(async () => {
  try {
    $q.loading.show({
      message: "Cargando Cuentas ...",
    });

    await cuentasStore.cargarCuentas();
    seleccionarCuenta.value = true
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

async function confirmarSeleccion() {
  if (cuentaMovimiento.value) {
    cuentaSeleccionada.value = true
    seleccionarCuenta.value = false
    onInitialRequest({
      pagination: initialPagination.value,
      filter: undefined,
    });
    await movimientosStore.listarMovimientos(false, cuentaMovimiento.value.value);
  } else {
    $q.notify({
      progress: true,
      message: 'Debe seleccionar una cuenta para visualizar los movimientos',
      icon: "error",
      color: "red",
      textColor: "white",
    });
  }

}

async function seleccionarNuevaCuenta() {
  cuentaMovimiento.value = null
  cuentaSeleccionada.value = false
  seleccionarCuenta.value = true
}

const optionsTipoMovimiento = ref([
  { label: "Ingreso", value: "ingreso" },
  { label: "Egreso", value: "egreso" },
]);

const optionsCuentas = computed({
  get() {
    return cuentasStore.cuentas;
  },
});

const movimientos = computed({
  get() {
    return movimientosStore.records.data;
  },
});

const optionsCategoria = ref([
  "Utilidades",
  "Ropa",
  "Educación",
  "Entretenimiento",
  "Salud",
  "Comida",
  "Beleza",
  "Casa",
  "Transporte",
  "Viajes",
  "Mascotas",
  "Otros",
]);

const columnsMovimientos = [

  {
    name: "descripcion",
    required: true,
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  {
    name: "valor_movimiento",
    align: "center",
    label: "Monto",
    field: "valor_movimiento",
  },
  {
    name: "tipo_movimiento",
    align: "center",
    label: "Tipo",
    field: "tipo_movimiento",
  },
  {
    name: "fecha_movimiento",
    align: "center",
    label: "Fecha",
    field: "fecha_movimiento",
  },
  {
    name: "id_cuenta",
    align: "center",
    label: "Cuenta",
    field: "id_cuenta",
  },
  {
    name: "categoria_transaccion",
    align: "center",
    label: "Categoría",
    field: "categoria_transaccion",
  },
];

function agregarNuevoMovimiento() {
  nuevoMovimiento.value = true;
}

async function confirmarMovimiento() {
  console.log("cuentaMovimiento.value", cuentaMovimiento.value)
  const nuevoMovimientoData = {
    valor_movimiento: montoMovimiento.value,
    tipo_movimiento: tipoMovimiento.value.value,
    id_cuenta: cuentaMovimiento.value.value,
    fecha_movimiento: fechaMovimiento.value,
    descripcion: descripcionMovimiento.value,
    categoria_transaccion: categoriaMovimiento.value,
  };

  try {
    $q.loading.show({
      message: "Registrando Movimiento ...",
    });

    const nuevoMovimiento = await movimientosStore.agregarMovimiento(
      nuevoMovimientoData
    );

    if (nuevoMovimiento.respuesta.estado == "OK") {
      $q.notify({
        progress: true,
        message: "se agregó correctamente",
        icon: "done",
        color: "white",
        textColor: "primary",
      });
      nuevoMovimiento.value = false;
      onRequest(1)
    } else {
      $q.notify({
        progress: true,
        message: nuevoMovimiento.respuesta.mensaje,
        icon: "error",
        color: "red",
        textColor: "white",
      });
    }
  } catch (error) {
    console.log(error, "errrorrrrrrreassdfsdf")
    $q.notify({
      progress: true,
      message: error,
      icon: "error",
      color: "red",
      textColor: "white",
    });
  } finally {
    $q.loading.hide();
    limpiarFormulario();
  }

}

function fixedNumber(number) {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(+number);
}

function limpiarFormulario() {
  descripcionMovimiento.value = "";
  montoMovimiento.value = null;
  tipoMovimiento.value = "";
  fechaMovimiento.value = null;
  categoriaMovimiento.value = null;
}

async function onInitialRequest() {
  if (movimientos.value.length === 0) {
    movimientosStore.pagination = movimientosStore.paginationOriginal;
  }
}

async function onRequest(pageNumber) {
  try {
    loading.value = true;

    $q.loading.show({
      message: "Cargando ...",
    });

    movimientosStore.pagination.page = +pageNumber;
    await movimientosStore.listarMovimientos(false, cuentaMovimiento.value.value);
  } catch (error) {
    $q.notify({
      progress: true,
      message: "Error al momento de cargar los registros. " + error.message,
      icon: "error",
      color: "red",
      textColor: "white",
    });
  } finally {
    loading.value = false;
    $q.loading.hide();
  }
}

async function ordenarPor(parametrosOrden) {
  const { page, rowsPerPage, sortBy, descending } = parametrosOrden.pagination;

  loading.value = true;

  initialPagination.value.page = page;
  initialPagination.value.rowsPerPage = rowsPerPage;
  initialPagination.value.sortBy = sortBy;
  initialPagination.value.descending = descending;

  movimientosStore.pagination.descending = descending;
  movimientosStore.pagination.page = page;
  await movimientosStore.listarMovimientos(false, cuentaMovimiento.value.value);
  loading.value = false;

  $q.loading.hide();
}
</script>

<style scoped>
.bg-section-alt {
  background-color: #ecf0f1;
}

.bg-dark {
  background-color: #2c3e50;
}

.text-main {
  color: #2c3e50;
}
</style>
