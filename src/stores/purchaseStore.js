// src/stores/purchaseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useProductStore } from './productStore'
import { useUserStore } from './userStore'

export const usePurchaseStore = defineStore(
  'purchaseStore',
  () => {
    const toast = useToast()
    const productStore = useProductStore()
    const userStore = useUserStore()

    const purchases = ref([])

    const purchaseDialog = ref(false)
    const selectedPurchase = ref({
      userId: null,
      productId: null,
      quantity: 1,
      price: 0,
    })
    const submitted = ref(false)

    const filters = ref({
      global: { value: null, matchMode: 'contains' },
    })

    const createId = () => Math.random().toString(36).substr(2, 9)

    const openNew = () => {
      selectedPurchase.value = {
        userId: null,
        productId: null,
        quantity: 1,
        price: 0,
      }
      submitted.value = false
      purchaseDialog.value = true
    }

    const hideDialog = () => {
      purchaseDialog.value = false
      submitted.value = false
    }

    const savePurchase = () => {
      submitted.value = true
      const { userId, productId, quantity, price } = selectedPurchase.value

      // Validações
      if (!userId || !productId || !quantity || quantity <= 0 || !price || price <= 0) {
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Preencha todos os campos corretamente',
          life: 3000,
        })
        return
      }

      const product = productStore.products.find((p) => p.id === productId)
      const user = userStore.users.find((u) => u.id === userId)

      if (!product || !user) {
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Usuário ou produto não encontrado',
          life: 3000,
        })
        return
      }

      if (product.quantity < quantity) {
        toast.add({
          severity: 'warn',
          summary: 'Estoque insuficiente',
          detail: 'Não há estoque suficiente para essa compra',
          life: 3000,
        })
        return
      }

      const newPurchase = {
        id: createId(),
        userId,
        userName: user.name,
        productId,
        productName: product.name,
        quantity,
        price, // Adicionando o preço unitário
        total: price * quantity, // Calculando o total
        date: new Date().toISOString(),
      }

      // Registra compra
      purchases.value.push(newPurchase)

      // Atualiza estoque
      product.quantity -= quantity

      toast.add({
        severity: 'success',
        summary: 'Compra registrada',
        detail: `Compra de ${quantity}x ${product.name} por ${user.name} - Total: ${formatCurrency(price * quantity)}`,
        life: 3000,
      })

      purchaseDialog.value = false
      selectedPurchase.value = {
        userId: null,
        productId: null,
        quantity: 1,
        price: 0,
      }
    }

    // Função auxiliar para formatar moeda
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    }

    return {
      purchases,
      selectedPurchase,
      purchaseDialog,
      submitted,
      filters,

      openNew,
      hideDialog,
      savePurchase,
      formatCurrency,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'purchase-store-data',
          storage: localStorage,
          paths: ['purchases'],
        },
      ],
    },
  },
)
