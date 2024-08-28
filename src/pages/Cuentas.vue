<template>
  <q-page padding class="bg-section-alt">
    <div class="text-center text-h3 text-bold text-main q-mb-lg">Cuentas</div>
    <div class="text-center text-subtitle text-secondary q-mb-md">Gestión de todas tus cuentas</div>

    <q-table
      :rows="accounts"
      :columns="columns"
      row-key="name"
      class="bg-dark text-white"
    >
      <template v-slot:top-right>
        <q-btn color="primary" label="Agregar cuenta" @click="showForm = !showForm" />
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="primary" @click="editAccount(props.row)" />
          <q-btn flat round icon="delete" color="negative" @click="deleteAccount(props.row)" />
        </q-td>
      </template>
    </q-table>

    <q-space class="q-mt-lg" />

    <q-card v-if="showForm" class="q-pa-md bg-light q-mt-lg">
      <q-card-section>
        <div class="text-h6 text-main q-mb-md">Agregar cuenta:</div>
        <q-form @submit.prevent="addAccount">
          <q-input
            v-model="newAccount.name"
            label="Nombre"
            outlined
            class="q-mb-md"
            :label-color="labelColor"
            :color="inputColor"
          />
          <q-select
            v-model="newAccount.accountType"
            label="Tipo de cuenta"
            :options="accountTypes"
            outlined
            class="q-mb-md"
            :label-color="labelColor"
            :color="inputColor"
          />
          <q-input
            v-model="newAccount.value"
            label="Valor"
            type="number"
            outlined
            class="q-mb-md"
            :label-color="labelColor"
            :color="inputColor"
          />
          <q-select
            v-model="newAccount.category"
            label="Categoría"
            :options="categories"
            outlined
            class="q-mb-md"
            :label-color="labelColor"
            :color="inputColor"
          />
          <q-input
            v-model="newAccount.initialBalance"
            label="Saldo inicial"
            type="number"
            outlined
            class="q-mb-md"
            :label-color="labelColor"
            :color="inputColor"
          />
          <q-input
            v-model="newAccount.currentBalance"
            label="Saldo actual"
            type="number"
            outlined
            class="q-mb-md"
            :label-color="labelColor"
            :color="inputColor"
          />

          <div class="q-mt-md">
            <q-btn type="submit" label="Agregar" color="primary" class="text-button-primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'CuentasPage',
  data() {
    return {
      showForm: false,
      accounts: [
        {
          name: 'Cuenta 1',
          accountType: 'Tipo 1',
          value: 10000,
          category: 'Categoría 1',
          initialBalance: 5000,
          currentBalance: 7000,
        },
        {
          name: 'Cuenta 2',
          accountType: 'Tipo 2',
          value: 20000,
          category: 'Categoría 2',
          initialBalance: 10000,
          currentBalance: 15000,
        },
        {
          name: 'Cuenta 3',
          accountType: 'Tipo 3',
          value: 30000,
          category: 'Categoría 3',
          initialBalance: 15000,
          currentBalance: 25000,
        },
      ],
      newAccount: {
        name: '',
        accountType: '',
        value: '',
        category: '',
        initialBalance: '',
        currentBalance: '',
      },
      accountTypes: ['Tipo 1', 'Tipo 2', 'Tipo 3'],
      categories: ['Categoría 1', 'Categoría 2', 'Categoría 3', 'Categoría 4', 'Categoría 5', 'Categoría 6'],
      columns: [
        { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
        { name: 'accountType', label: 'Tipo de cuenta', align: 'left', field: 'accountType' },
        { name: 'value', label: 'Valor', align: 'left', field: 'value' },
        { name: 'category', label: 'Categoría', align: 'left', field: 'category' },
        { name: 'initialBalance', label: 'Saldo inicial', align: 'left', field: 'initialBalance' },
        { name: 'currentBalance', label: 'Saldo actual', align: 'left', field: 'currentBalance' },
        { name: 'actions', label: 'Acciones', align: 'left', field: 'edit' },
      ],
      labelColor: '#2C3E50',
      inputColor: '#3498DB',
    };
  },
  methods: {
    addAccount() {
      this.accounts.push({ ...this.newAccount });
      this.resetNewAccount();
      this.showForm = false;
    },
    editAccount(account) {
      // Implementar lógica de edición
    },
    deleteAccount(account) {
      this.accounts = this.accounts.filter(a => a !== account);
    },
    resetNewAccount() {
      this.newAccount = {
        name: '',
        accountType: '',
        value: '',
        category: '',
        initialBalance: '',
        currentBalance: '',
      };
    }
  }
};
</script>

<style scoped>
.bg-section-alt {
  background-color: #ECF0F1;
}

.bg-dark {
  background-color: #2C3E50;
}

.bg-light {
  background-color: #ECF0F1;
}

.text-main {
  color: #2C3E50;
}

.text-button-primary {
  color: #ECF0F1;
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
