import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const toast = useToast()

    const users = ref([
      {
        id: 'U1',
        name: 'Maria Silva',
        email: 'maria@example.com',
        telefone: '11999999999',
      },
      {
        id: 'U2',
        name: 'João Souza',
        email: 'joao@example.com',
        telefone: '21988888888',
      },
    ])

    const selectedUsers = ref([])
    const userDialog = ref(false)
    const deleteUserDialog = ref(false)
    const deleteUsersDialog = ref(false)
    const user = ref({})
    const submitted = ref(false)

    const filters = ref({
      global: { value: null, matchMode: 'contains' },
    })

    // Funções auxiliares
    const createId = () => {
      return Math.random().toString(36).substr(2, 9)
    }

    const findIndexById = (id) => users.value.findIndex((u) => u.id === id)

    // Ações
    const openNew = () => {
      user.value = {}
      submitted.value = false
      userDialog.value = true
    }

    const hideDialog = () => {
      userDialog.value = false
      submitted.value = false
    }

    const saveUser = () => {
      submitted.value = true

      if (!user.value.name || !user.value.email || !user.value.telefone) return

      if (user.value.id) {
        // editar
        const index = findIndexById(user.value.id)
        if (index !== -1) {
          users.value[index] = { ...user.value }
          toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário atualizado',
            life: 3000,
          })
        }
      } else {
        // criar
        user.value.id = createId()
        users.value.push({ ...user.value })
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado',
          life: 3000,
        })
      }

      userDialog.value = false
      user.value = {}
    }

    const editUser = (u) => {
      user.value = { ...u }
      userDialog.value = true
    }

    const confirmDeleteUser = (u) => {
      user.value = u
      deleteUserDialog.value = true
    }

    const deleteUser = () => {
      users.value = users.value.filter((u) => u.id !== user.value.id)
      deleteUserDialog.value = false
      user.value = {}

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Usuário removido',
        life: 3000,
      })
    }

    const confirmDeleteSelected = () => {
      deleteUsersDialog.value = true
    }

    const deleteSelectedUsers = () => {
      users.value = users.value.filter((u) => !selectedUsers.value.includes(u))
      deleteUsersDialog.value = false
      selectedUsers.value = []

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Usuários removidos',
        life: 3000,
      })
    }

    return {
      users,
      selectedUsers,
      userDialog,
      deleteUserDialog,
      deleteUsersDialog,
      user,
      submitted,
      filters,

      openNew,
      hideDialog,
      saveUser,
      editUser,
      confirmDeleteUser,
      deleteUser,
      confirmDeleteSelected,
      deleteSelectedUsers,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'user-store-data',
          storage: localStorage,
          paths: ['users'],
        },
      ],
    },
  },
)
