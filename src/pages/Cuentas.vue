<template>
  <!--Inicio del dialog de nuevo usuario-->

  <q-dialog v-model="nuevaCuenta" persistent>
    <q-card>
      <q-toolbar>
        <q-avatar square>
          <q-icon name="payments" />
        </q-avatar>
        <q-item-section>
          <div class="text-grey-14 text-weight-bolder">Creacion de cuenta</div>
        </q-item-section>
      </q-toolbar>

      <q-separator />

      <q-form
        @submit="confirmarNuevaCuenta"
        @reset="limpiarAlerta"
        class="q-gutter-md"
      >
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 q-pa-md">
              <span class="text-subtitle1 text-weight-bold"
                >Nombre de la cuenta</span
              >
              <div>
                <q-input
                  outlined
                  v-model="nombreCuenta"
                  label="Nombre"
                  :rules="[
                    (val) => val !== '' || 'Por favor rellene este campo',
                  ]"
                />
              </div>
            </div>

            <div class="col-lg-6 col-md-5 col-sm-5 col-xs-5 q-pa-md">
              <span class="text-subtitle1 text-weight-bold"
                >Tipo de cuenta</span
              >
              <q-select
                outlined
                :options="optionsTipoCuenta"
                v-model="tipoCuenta"
                label="Tipo"
                :rules="[(val) => val !== '' || 'Por favor rellene este campo']"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 q-pa-md">
              <span class="text-subtitle1 text-weight-bold"
                >Saldo actual de la cuenta</span
              >
              <div>
                <q-input
                  outlined
                  v-model="saldoCuenta"
                  prefix="$"
                  mask="###.###.###.###.###.###.###.###.###.###"
                  maxlength="21"
                  reverse-fill-mask
                  unmasked-value
                  label="Saldo"
                  lazy-rules
                  :rules="[
                    (val) => (val !== null && val !== '') || 'Ingrese el saldo',
                    (val) => val >= 0 || 'Ingrese un saldo válido',
                  ]"
                />
              </div>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 q-pa-md">
              <span class="text-subtitle1 text-weight-bold"
                >Descripcion de la cuenta</span
              >
              <div>
                <q-input
                  outlined
                  autogrow
                  v-model="descripcion"
                  label="Descripcion"
                  type="textarea"
                />
              </div>
            </div>

            <div class="col-lg-6 col-md-5 col-sm-5 col-xs-5 q-pa-md">
              <span class="text-subtitle1 text-weight-bold">Banco</span>
              <q-select
                outlined
                :options="optionsBanco"
                v-model="banco"
                label="banco"
                :rules="[(val) => val !== '' || 'Por favor rellene este campo']"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-5 col-sm-5 col-xs-5 q-pa-md">
              <span class="text-subtitle1 text-weight-bold"
                >Fecha de ultima transaccion</span
              >
              <q-input
                outlined
                label="Fecha ultima transaccion"
                v-model="fechaTransaccion"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        :locale="fechaEs"
                        v-model="fechaTransaccion"
                        minimal
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <div class="col-lg-6 row justify-center">
          <q-card-section class="row items-center q-gutter-sm">
            <q-btn label="Confirmar" color="primary" type="submit" />
            <q-btn
              v-close-popup
              type="reset"
              label="Cancelar"
              color="primary"
            />
          </q-card-section>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
  <q-page padding class="bg-section-alt">
    <div class="text-center text-h3 text-bold text-main q-mb-lg">Cuentas</div>
    <div class="text-center text-subtitle text-secondary q-mb-md">
      Gestión de todas tus cuentas
    </div>
    <q-table
      class="bg-dark text-white"
      @request="ordenarPor"
      :rows="rows"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="id"
      :grid="mode == 'grid'"
      :loading="loading"
      binary-state-sort
      :rows-per-page-options="[0]"
      hide-pagination
      v-model:pagination="initialPagination"
      no-data-label="No se encontraron datos"
      no-results-label="El filtro no encontró ningún resultado"
    >
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
        <q-tr :props="props" v-if="!isLoading">
          <q-td key="nombre_cuenta" :props="props">
            {{ props.row.nombre_cuenta }}
          </q-td>
          <q-td key="tipo_cuenta" :props="props">
            {{ props.row.tipo_cuenta }}
          </q-td>
          <q-td key="saldo_actual" :props="props">
            {{ fixedNumber(props.row.saldo_actual) }}
          </q-td>
          <q-td key="banco" :props="props">
            {{ props.row.id_banco.nombre }}
          </q-td>

          <q-td auto-width>
            <div class="row q-pr-md">
              <div class="col q-pl-md">
                <q-btn
                  @click="editarCuenta(JSON.stringify(props.row.id))"
                  flat
                  bordered
                  class
                  size="10px"
                  round
                  color="transparent"
                  text-color="primary"
                  icon="edit"
                >
                  <q-tooltip class="bg-grey-6">Editar cuenta</q-tooltip>
                </q-btn>
              </div>
              <div class="col q-pl-md">
                <q-btn
                  @click="enviarReporte(JSON.stringify(props.row.id))"
                  flat
                  bordered
                  class
                  size="10px"
                  round
                  color="transparent"
                  text-color="primary"
                  icon="mail"
                >
                  <q-tooltip class="bg-grey-6">Enviar reporte</q-tooltip>
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
            <q-btn
              @click="agregarNuevaCuenta()"
              color="primary"
              label="Agregar Cuenta"
              text-color="white"
            />
          </div>
        </div>
      </template>
      <template v-slot:top-left>
        <q-toolbar>
          <q-avatar square icon="account" font-size="30px"> </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">Cuentas</span></q-toolbar-title
          >
        </q-toolbar>
      </template>

      <template v-slot:bottom>
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-pagination
            v-if="localPagination.rowsNumber > 0"
            v-model="currentPage"
            :max="maxPage"
            :max-pages="6"
            boundary-numbers
            @update:modelValue="onRequest"
          />
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent } from "vue";
import { useCuentasStore } from "stores/cuentas-store.js";
import { useBancosStore } from "stores/bancos-store.js";
import { useRouter } from "vue-router";
import { useQuasar, date } from "quasar";

defineComponent({
  name: "CuentasPage",
});
const columns = [
  {
    name: "nombre_cuenta",
    required: true,
    label: "Nombre de cuenta",
    align: "center",
    field: "nombre_cuenta",
  },
  {
    name: "tipo_cuenta",
    align: "center",
    label: "Tipo de cuenta",
    field: "tipo_cuenta",
  },
  {
    name: "saldo_actual",
    align: "center",
    label: "Saldo de cuenta",
    field: "saldo_actual",
  },
  {
    name: "banco",
    align: "center",
    label: "Banco",
    field: "banco",
  },
];

const optionsTipoCuenta = ref([
  {
    label: "Débito",
    value: "Debito",
  },
  {
    label: "Corriente",
    value: "Corriente",
  },
  {
    label: "Crédito",
    value: "Credito",
  },
  {
    label: "Nomina",
    value: "Nomina",
  },
  {
    label: "CDT",
    value: "Cdt",
  },
]);
const optionsBanco = computed({
  get() {
    return bancosStore.bancos;
  },
});

const nuevaCuenta = ref(false);
const nombreCuenta = ref(null);
const tipoCuenta = ref(null);
const saldoCuenta = ref(null);
const descripcion = ref(null);
const banco = ref(null);
const fechaTransaccion = ref(null);
function fixedNumber(number) {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(+number);
}

const router = useRouter();
const cuentasStore = useCuentasStore();
const bancosStore = useBancosStore();
const $q = useQuasar();
const rows = computed({
  get() {
    return cuentasStore.records.data;
  },
});

const localPagination = computed({
  get() {
    return cuentasStore.pagination;
  },
});

const maxPage = computed(() =>
  Math.ceil(
    cuentasStore.pagination.rowsNumber / cuentasStore.pagination.rowsPerPage
  )
);

const currentPage = computed({
  get() {
    return +cuentasStore.pagination.page;
  },
  async set(pageNumber) {
    cuentasStore.pagination.page = pageNumber;
  },
});

const mode = ref("list");
const loading = ref(false);
const isLoading = ref(false);

const initialPagination = ref({
  sortBy: "nombre_cuenta",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

async function enviarReporte(idcuenta) {
  try {
    $q.loading.show({
      message: "Cargando Cuentas ...",
    });
    await cuentasStore.enviarReporte(idcuenta)
    $q.notify({
        progress: true,
        message: "El reporte fue enviado a su correo. ",
        icon: "done",
        color: "white",
        textColor: "primary",
      });
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
        message: "Error al momento de generar el reporte. ",
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

onMounted(async () => {
  onInitialRequest({
    pagination: initialPagination.value,
    filter: undefined,
  });
  try {
    isLoading.value = true;
    $q.loading.show({
      message: "Cargando Cuentas ...",
    });

    await cuentasStore.listarCuentas(true);
    await bancosStore.cargarBancos();
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
    isLoading.value = false;
    $q.loading.hide();
  }
});
function agregarNuevaCuenta() {
  nuevaCuenta.value = true;
}

async function confirmarNuevaCuenta() {
  try {
    $q.loading.show({ message: "Creando..." });

    const params = {
      nombre_cuenta: nombreCuenta.value,
      saldo_actual: saldoCuenta.value,
      tipo_cuenta: tipoCuenta.value.value,
      descripcion: descripcion.value,
      fecha_creacion: new Date(),
      fecha_transaccion: fechaTransaccion.value,
      id_banco: banco.value.value,
    };

    //aqui debe ir el store
    await cuentasStore.agregarCuenta(params);

    nuevaCuenta.value = false;
    onRequest(1);
    $q.notify({
      message: "Se creó la cuenta exitosamente",
      icon: "done",
      color: "white",
      textColor: "primary",
    });
  } catch (error) {
    $q.notify({
      message: error,
      icon: "warning",
      color: "white",
      textColor: "red",
    });
  } finally {
    $q.loading.hide();
  }
}

function editarCuenta(idcuenta) {
  const encoded = window.btoa(idcuenta);
  router.push("/main/cuenta/editar/" + encoded);
}

async function onInitialRequest() {
  if (rows.value.length === 0) {
    cuentasStore.pagination = cuentasStore.paginationOriginal;
  }
}

async function onRequest(pageNumber) {
  try {
    loading.value = true;

    $q.loading.show({
      message: "Cargando ...",
    });

    cuentasStore.pagination.page = +pageNumber;
    await cuentasStore.listarCuentas();
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

  cuentasStore.pagination.descending = descending;
  cuentasStore.pagination.page = page;
  await cuentasStore.listarCuentas();
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

.bg-light {
  background-color: #ecf0f1;
}

.text-main {
  color: #2c3e50;
}

.text-button-primary {
  color: #ecf0f1;
}

.text-subtitle {
  font-size: 1.25rem;
}

.q-mb-md {
  margin-bottom: 16px;
}

.q-mt-md {
  margin-top: 16px;
}

.q-mb-lg {
  margin-bottom: 32px;
}

.q-mt-lg {
  margin-top: 32px;
}
</style>
