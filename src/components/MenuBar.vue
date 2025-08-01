<template>
  <div class="card">
    <Menubar :model="items">
      <template #start>
        <i class="pi pi-crown" style="font-size: 2.5rem; color: green"></i>
      </template>
      <template>
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span>Produtos</span>
          <Badge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <span
            v-if="item.shortcut"
            class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down ml-auto',
              { 'pi-angle-down': root, 'pi-angle-right': !root },
            ]"
          ></i>
        </a>
      </template>
      <template #end>
        <div>
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menubar } from 'primevue'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = ref([
  {
    label: 'Produtos',
    icon: 'pi pi-cart-plus',
    command: () => {
      router.push('/')
    },
  },
  {
    label: 'Usuários',
    icon: 'pi pi-user',
    command: () => {
      router.push('/usuarios')
    },
  },
  {
    label: 'Compras',
    icon: 'pi pi-shop',
    command: () => {
      router.push('/compras')
    },
  },
])
</script>
<style scoped>
.p-menubar {
  border: none;
}
</style>
