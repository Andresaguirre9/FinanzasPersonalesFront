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

      <q-form
        @submit="confirmarMovimiento"
        @reset="limpiarFormulario"
        class="q-gutter-md"
      >
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-input
                outlined
                v-model="descripcionMovimiento"
                label="Descripción"
                :rules="[(val) => val !== '' || 'Este campo es obligatorio']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-input
                outlined
                v-model="montoMovimiento"
                prefix="$"
                mask="### ### ### ### ### ### ### ### ### ###"
                label="Monto"
                :rules="[(val) => val > 0 || 'Ingrese un valor correcto']"
                reverse-fill-mask
                unmasked-value
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-select
                outlined
                v-model="tipoMovimiento"
                :options="optionsTipoMovimiento"
                label="Tipo"
                :rules="[(val) => !!val || 'Seleccione un tipo']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-input
                outlined
                v-model="fechaMovimiento"
                type="date"
                label="Fecha del Movimiento"
                :rules="[(val) => !!val || 'Seleccione una fecha']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-select
                outlined
                v-model="cuentaMovimiento"
                :options="optionsCuentas"
                label="Cuenta"
                :rules="[(val) => !!val || 'Seleccione una cuenta']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 q-pa-md">
              <q-select
                outlined
                v-model="categoriaMovimiento"
                :options="optionsCategoria"
                label="Categoría de Transacción"
                :rules="[(val) => !!val || 'Seleccione una categoría']"
              />
            </div>
          </div>
        </q-card-section>

        <div class="q-card-actions row justify-center q-gutter-sm q-pa-sm">
          <q-btn label="Confirmar" color="primary" type="submit" />
          <q-btn label="Cancelar" color="primary" type="reset" v-close-popup/>
        </div>
      </q-form>
    </q-card>
  </q-dialog>

  <q-page padding class="bg-section-alt">
    <div class="text-center text-h3 text-main q-mb-lg">Movimientos</div>
    <q-table :rows="movimientos" :columns="columnsMovimientos" row-key="id">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in columnsMovimientos" :key="col.name">{{
            props.row[col.field]
          }}</q-td>
          <q-td>
            <q-btn
              icon="edit"
              color="primary"
              @click="editarMovimiento(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-btn
          label="Agregar Movimiento"
          color="primary"
          @click="agregarNuevoMovimiento"
        />
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCuentasStore } from "stores/cuentas-store.js";
import { useMovimientosStore } from "stores/movimientos-store.js";
import { useQuasar } from "quasar";

const nuevoMovimiento = ref(false);
const descripcionMovimiento = ref("");
const montoMovimiento = ref(null);
const tipoMovimiento = ref("");
const fechaMovimiento = ref(null);
const $q = useQuasar();

const cuentaMovimiento = ref(null);
const categoriaMovimiento = ref("");
const cuentasStore = useCuentasStore();
const movimientosStore = useMovimientosStore();

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

const movimientos = ref([
  // Aquí irían los datos de los movimientos
]);

const optionsTipoMovimiento = ref([
  { label: "Ingreso", value: "ingreso" },
  { label: "Egreso", value: "egreso" },
]);

const optionsCuentas = computed({
  get() {
    return cuentasStore.cuentas;
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
  { name: "monto", label: "Monto", align: "center", field: "monto" },
  { name: "tipo", label: "Tipo", align: "center", field: "tipo" },
  { name: "fecha", label: "Fecha", align: "center", field: "fecha_movimiento" },
  { name: "cuenta", label: "Cuenta", align: "center", field: "id_cuenta" },
  {
    name: "categoria",
    label: "Categoría",
    align: "center",
    field: "categoria_transaccion",
  },
];

function agregarNuevoMovimiento() {
  nuevoMovimiento.value = true;
}

async function confirmarMovimiento() {
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

  // Limpiar campos
}

function limpiarFormulario() {
  descripcionMovimiento.value = "";
  montoMovimiento.value = null;
  tipoMovimiento.value = "";
  fechaMovimiento.value = null;
  cuentaMovimiento.value = null;
  categoriaMovimiento.value = null;
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
