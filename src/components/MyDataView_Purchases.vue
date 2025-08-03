<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New Purchase" icon="pi pi-plus" class="mr-2" @click="openNew" />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="purchases"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} purchases"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Purchases</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters.global.value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column field="userName" header="User" sortable style="min-width: 16rem" />
        <Column field="productName" header="Product" sortable style="min-width: 16rem" />
        <Column field="quantity" header="Quantity" sortable style="min-width: 8rem" />
        <Column field="price" header="Price" sortable style="min-width: 10rem">
          <template #body="slotProps">
            {{ formatPrice(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="total" header="Total" sortable style="min-width: 10rem">
          <template #body="slotProps">
            {{ formatPrice(slotProps.data.price * slotProps.data.quantity) }}
          </template>
        </Column>
        <Column field="date" header="Date" sortable style="min-width: 12rem">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.date) }}
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog: Add New Purchase -->
    <Dialog
      v-model:visible="purchaseDialog"
      :style="{ width: '450px' }"
      header="Purchase Details"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="userId" class="block font-bold mb-3">User</label>
          <Dropdown
            id="userId"
            v-model="selectedPurchase.userId"
            :options="userStore.users"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a user"
            :invalid="submitted && !selectedPurchase.userId"
          />
          <small v-if="submitted && !selectedPurchase.userId" class="text-red-500"
            >User is required.</small
          >
        </div>

        <div>
          <label for="productId" class="block font-bold mb-3">Product</label>
          <Dropdown
            id="productId"
            v-model="selectedPurchase.productId"
            :options="productStore.products"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a product"
            :invalid="submitted && !selectedPurchase.productId"
            @change="updateProductPrice"
          />
          <small v-if="submitted && !selectedPurchase.productId" class="text-red-500"
            >Product is required.</small
          >
        </div>

        <div>
          <label for="price" class="block font-bold mb-3">Unit Price</label>
          <InputNumber
            id="price"
            v-model="selectedPurchase.price"
            mode="currency"
            currency="USD"
            locale="en-US"
            :min="0"
            :disabled="!selectedPurchase.productId"
            :invalid="submitted && (!selectedPurchase.price || selectedPurchase.price <= 0)"
          />
          <small
            v-if="submitted && (!selectedPurchase.price || selectedPurchase.price <= 0)"
            class="text-red-500"
            >Valid price is required.</small
          >
        </div>

        <div>
          <label for="quantity" class="block font-bold mb-3">Quantity</label>
          <InputNumber
            id="quantity"
            v-model="selectedPurchase.quantity"
            mode="decimal"
            :min="1"
            :max="getMaxQuantity()"
            :invalid="submitted && (!selectedPurchase.quantity || selectedPurchase.quantity <= 0)"
          />
          <small
            v-if="submitted && (!selectedPurchase.quantity || selectedPurchase.quantity <= 0)"
            class="text-red-500"
            >Valid quantity is required.</small
          >
          <small v-if="selectedPurchase.productId" class="text-gray-500">
            Available: {{ getAvailableQuantity() }}
          </small>
        </div>

        <div class="font-bold">
          <label>Total: </label>
          <span>{{ formatPrice(selectedPurchase.price * selectedPurchase.quantity) }}</span>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="savePurchase" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useProductStore } from '@/stores/productStore'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { format } from 'date-fns'

const dt = ref(null)

const purchaseStore = usePurchaseStore()
const productStore = useProductStore()
const userStore = useUserStore()

const { purchases, selectedPurchase, purchaseDialog, submitted, filters } =
  storeToRefs(purchaseStore)

const { openNew, hideDialog, savePurchase } = purchaseStore

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MM/dd/yyyy HH:mm')
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const getAvailableQuantity = () => {
  if (!selectedPurchase.value.productId) return 0
  const product = productStore.products.find((p) => p.id === selectedPurchase.value.productId)
  return product ? product.quantity : 0
}

const getMaxQuantity = () => {
  return getAvailableQuantity()
}

const updateProductPrice = () => {
  if (selectedPurchase.value.productId) {
    const product = productStore.products.find((p) => p.id === selectedPurchase.value.productId)
    selectedPurchase.value.price = product ? product.price : 0
  } else {
    selectedPurchase.value.price = 0
  }
}

const exportCSV = () => {
  dt.value.exportCSV()
}

watch(() => selectedPurchase.value.productId, updateProductPrice)
</script>
