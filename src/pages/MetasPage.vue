<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Lista de Metas</div>
      </q-card-section>

      <!-- Listado de Metas -->
      <q-card-section>
        <q-list bordered>
          <q-item v-for="meta in metas" :key="meta.id" class="q-mb-sm">
            <q-item-section>
              <div class="text-subtitle1">{{ meta.descripcion_meta }}</div>
              <div>Estado: {{ meta.estado }}</div>
              <div>Creación: {{ meta.fecha_creacion }}</div>
              <q-linear-progress
                :value="meta.cantidad_abonada / meta.cantidad_meta"
                color="primary"
                track-color="grey-3"
                :label="`${meta.cantidad_abonada} / ${meta.cantidad_meta}`"
                class="q-mt-xs"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- Formulario para Nueva Meta -->
      <q-card-section>
        <div class="text-h6 q-mt-md">Agregar Nueva Meta</div>
        <q-form @submit="guardarMeta">
          <q-input
            v-model="nuevaDescripcionMeta"
            label="Descripción de la Meta"
            required
          />
          <q-input
            v-model="nuevaCantidadMeta"
            label="Cantidad Objetivo"
            type="number"
            :rules="[val => val > 0 || 'Debe ser un valor positivo']"
            required
          />
          <q-input
            v-model="nuevaCantidadAbonada"
            label="Cantidad Abonada"
            type="number"
            :rules="[val => val >= 0 || 'Debe ser un valor no negativo']"
          />
          <q-select
            v-model="nuevoEstadoMeta"
            :options="optionsEstado"
            label="Estado"
            required
          />
          <q-input
            v-model="nuevoIdLogin"
            label="ID Login"
            type="number"
            required
          />
          <q-input
            v-model="nuevaFechaCreacion"
            label="Fecha de Creación"
            type="date"
            required
          />

          <q-btn label="Guardar Meta" type="submit" color="primary" class="q-mt-md" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Campos para la lista de metas y el formulario
const metas = ref([]);
const nuevaDescripcionMeta = ref('');
const nuevaCantidadMeta = ref(null);
const nuevaCantidadAbonada = ref(0);
const nuevoEstadoMeta = ref('');
const nuevoIdLogin = ref(null);
const nuevaFechaCreacion = ref(null);

const optionsEstado = ref([
  { label: 'En progreso', value: 'en_progreso' },
  { label: 'Completado', value: 'completado' },
  { label: 'Pendiente', value: 'pendiente' }
]);

// Función para cargar las metas desde el backend
const cargarMetas = async () => {
  try {
    const response = await fetch('/api/metas');
    metas.value = await response.json();
  } catch (error) {
    console.error('Error al cargar metas:', error);
  }
};

// Función para guardar una nueva meta
const guardarMeta = async () => {
  const nuevaMeta = {
    descripcion_meta: nuevaDescripcionMeta.value,
    cantidad_meta: nuevaCantidadMeta.value,
    cantidad_abonada: nuevaCantidadAbonada.value,
    estado: nuevoEstadoMeta.value,
    id_login: nuevoIdLogin.value,
    fecha_creacion: nuevaFechaCreacion.value,
  };

  try {
    const response = await fetch('/api/metas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaMeta),
    });

    const data = await response.json();
    // Añadimos la nueva meta a la lista localmente
    metas.value.push(data);

    // Limpiar el formulario
    limpiarFormulario();
  } catch (error) {
    console.error('Error al guardar meta:', error);
  }
};

function limpiarFormulario() {
  nuevaDescripcionMeta.value = '';
  nuevaCantidadMeta.value = null;
  nuevaCantidadAbonada.value = 0;
  nuevoEstadoMeta.value = '';
  nuevoIdLogin.value = null;
  nuevaFechaCreacion.value = null;
}

// Cargar las metas cuando se monta el componente
onMounted(cargarMetas);
</script>

<style scoped>
.q-page {
  max-width: 600px;
  margin: auto;
}

.q-linear-progress {
  height: 20px;
}

.text-subtitle1 {
  font-weight: bold;
}
</style>
