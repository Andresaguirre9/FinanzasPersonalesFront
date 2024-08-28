<template>
  <q-page padding class="bg-section">
    <div class="q-pa-md text-h3 text-bold text-center text-primary">Bienvenido a tu Dashboard de Finanzas Personales</div>
    <div class="q-pa-sm text-h6 text-center text-secondary">Administra tus ingresos, gastos y ahorros en un solo lugar.</div>

    <q-card class="q-ma-md q-pa-md">
      <q-card-section class="bg-header text-header text-center q-pa-md">
        <div class="text-h4">Saldo Actual</div>
        <div class="text-h2 text-bold">$ 10.000.000</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="bg-dark text-white row justify-between">
        <div class="col">
          <q-icon name="arrow_upward" class="q-mr-sm" />
          Ingresos
        </div>
        <div>$ 20.000.000</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="bg-dark text-white row justify-between">
        <div class="col">
          <q-icon name="arrow_downward" class="q-mr-sm" />
          Gastos
        </div>
        <div>$ 10.000.000</div>
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
        <div v-if="mensajeValidacion" class="q-mt-md text-negative">{{ mensajeValidacion }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PrincipalPage',
  data() {
    return {
      fechaInicio: '',
      fechaFin: '',
      mensajeValidacion: ''
    }
  },
  methods: {
    goToCuentas() {
      this.$router.push('/cuentas');
    },
    buscar() {
      if (this.fechaInicio && this.fechaFin) {
        if (this.fechaInicio > this.fechaFin) {
          this.mensajeValidacion = 'La fecha de inicio no puede ser mayor que la fecha de fin.';
        } else {
          this.mensajeValidacion = 'Fechas válidas.';
          // Lógica adicional para la búsqueda puede ir aquí
        }
      } else {
        this.mensajeValidacion = 'Por favor, seleccione ambas fechas.';
      }
    }
  }
}
</script>

<style scoped>
.bg-header {
  background-color: #2C3E50;
}

.text-header {
  color: #ECF0F1;
}

.bg-section {
  background-color: #ECF0F1;
}

.bg-dark {
  background-color: #2C3E50;
}

.text-white {
  color: #ECF0F1;
}

.text-primary {
  color: #3498DB;
}

.text-secondary {
  color: #95A5A6;
}

.text-negative {
  color: #E74C3C;
}

.text-center {
  text-align: center;
}
</style>
