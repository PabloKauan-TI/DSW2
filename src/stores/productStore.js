import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export const useProductStore = defineStore(
  'productStore',
  () => {
    const toast = useToast()

    const products = ref([
      {
        id: 'A1B2C',
        code: 'P001',
        name: 'Apple iPhone 12',
        description: 'Latest Apple iPhone with A14 Bionic chip',
        price: 999.99,
        category: 'Electronics',
        quantity: 10,
        rating: 4,
        image: 'iphone.svg',
        inventoryStatus: 'INSTOCK',
      },
      {
        id: 'D3E4F',
        code: 'P002',
        name: 'Running Shoes',
        description: 'Comfortable running shoes',
        price: 120.0,
        category: 'Fitness',
        quantity: 25,
        rating: 3,
        image: 'shoes.svg',
        inventoryStatus: 'LOWSTOCK',
      },
    ])

    const selectedProducts = ref([])
    const productDialog = ref(false)
    const deleteProductDialog = ref(false)
    const deleteProductsDialog = ref(false)
    const product = ref({})
    const submitted = ref(false)

    const filters = ref({
      global: { value: null, matchMode: 'contains' },
    })

    const statuses = [
      { label: 'INSTOCK', value: 'INSTOCK' },
      { label: 'LOWSTOCK', value: 'LOWSTOCK' },
      { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' },
    ]

    const formatCurrency = (value) => {
      if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      return ''
    }

    const findIndexById = (id) => products.value.findIndex((p) => p.id === id)

    const createId = () => {
      let id = ''
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return id
    }

    // CRUD
    const openNew = () => {
      product.value = {}
      submitted.value = false
      productDialog.value = true
    }

    const hideDialog = () => {
      productDialog.value = false
      submitted.value = false
    }

    const saveProduct = () => {
      submitted.value = true

      if (!product.value.name || !product.value.name.trim()) {
        return // nome obrigatório
      }

      if (product.value.id) {
        // editar
        const index = findIndexById(product.value.id)
        if (index !== -1) {
          // Garantir que o inventoryStatus esteja no formato certo
          product.value.inventoryStatus =
            typeof product.value.inventoryStatus === 'object'
              ? product.value.inventoryStatus.value
              : product.value.inventoryStatus

          products.value[index] = { ...product.value }
          toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Updated',
            life: 3000,
          })
        }
      } else {
        // criar
        product.value.id = createId()
        product.value.code = createId()
        product.value.image = product.value.image || 'product-placeholder.svg'
        product.value.inventoryStatus = product.value.inventoryStatus
          ? typeof product.value.inventoryStatus === 'object'
            ? product.value.inventoryStatus.value
            : product.value.inventoryStatus
          : 'INSTOCK'

        products.value.push({ ...product.value })
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        })
      }

      productDialog.value = false
      product.value = {}
    }

    const editProduct = (prod) => {
      product.value = { ...prod }
      productDialog.value = true
    }

    const confirmDeleteProduct = (prod) => {
      product.value = prod
      deleteProductDialog.value = true
    }

    const deleteProduct = () => {
      products.value = products.value.filter((p) => p.id !== product.value.id)
      deleteProductDialog.value = false
      product.value = {}
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Deleted',
        life: 3000,
      })
    }

    const confirmDeleteSelected = () => {
      deleteProductsDialog.value = true
    }

    const deleteSelectedProducts = () => {
      S
      products.value = products.value.filter((p) => !selectedProducts.value.includes(p))
      deleteProductsDialog.value = false
      selectedProducts.value = []
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Products Deleted',
        life: 3000,
      })
    }

    return {
      products,
      selectedProducts,
      productDialog,
      deleteProductDialog,
      deleteProductsDialog,
      product,
      submitted,
      filters,
      statuses,

      formatCurrency,
      openNew,
      hideDialog,
      saveProduct,
      editProduct,
      confirmDeleteProduct,
      deleteProduct,
      confirmDeleteSelected,
      deleteSelectedProducts,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'product-store-data',
          storage: localStorage,
          paths: ['products'],
        },
      ],
    },
  },
)
