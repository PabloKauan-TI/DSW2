<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="confirmDeleteSelected"
            :disabled="!selectedUsers.length"
          />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedUsers"
        :value="users"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Users</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters.global.value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
        <Column field="name" header="Name" sortable style="min-width: 16rem" />
        <Column field="email" header="Email" sortable style="min-width: 16rem" />
        <Column field="telefone" header="Telefone" sortable style="min-width: 12rem" />
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editUser(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteUser(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog: Add/Edit User -->
    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '450px' }"
      header="User Details"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
            id="name"
            v-model.trim="user.name"
            required
            autofocus
            :invalid="submitted && !user.name"
            fluid
          />
          <small v-if="submitted && !user.name" class="text-red-500">Name is required.</small>
        </div>

        <div>
          <label for="email" class="block font-bold mb-3">Email</label>
          <InputText
            id="email"
            v-model.trim="user.email"
            required
            :invalid="submitted && !user.email"
            fluid
          />
          <small v-if="submitted && !user.email" class="text-red-500">Email is required.</small>
        </div>

        <div>
          <label for="telefone" class="block font-bold mb-3">Telefone</label>
          <InputText
            id="telefone"
            v-model.trim="user.telefone"
            required
            :invalid="submitted && !user.telefone"
            fluid
          />
          <small v-if="submitted && !user.telefone" class="text-red-500"
            >Telefone is required.</small
          >
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveUser" />
      </template>
    </Dialog>

    <!-- Dialog: Delete Single User -->
    <Dialog
      v-model:visible="deleteUserDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="user">
          Are you sure you want to delete <b>{{ user.name }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteUserDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteUser" severity="danger" />
      </template>
    </Dialog>

    <!-- Dialog: Delete Selected Users -->
    <Dialog
      v-model:visible="deleteUsersDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>Are you sure you want to delete the selected users?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteUsersDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteSelectedUsers" severity="danger" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const dt = ref(null)

const store = useUserStore()

const {
  users,
  selectedUsers,
  userDialog,
  deleteUserDialog,
  deleteUsersDialog,
  user,
  submitted,
  filters,
} = storeToRefs(store)

const {
  openNew,
  hideDialog,
  saveUser,
  editUser,
  confirmDeleteUser,
  deleteUser,
  confirmDeleteSelected,
  deleteSelectedUsers,
} = store

const exportCSV = () => {
  dt.value.exportCSV()
}
</script>
