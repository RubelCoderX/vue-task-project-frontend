<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import axiosInstance from '@/lib/axios'
import Button from '../ui/button/Button.vue'
import SidebarLink from './SidebarLink.vue'

const links = [
  {
    title: 'Dashboard',
    to: '/',
    icon: 'lucide:house',
  },
]

const handleLogOut = async () => {
  try {
    // Call the API to log out
    await axiosInstance.post('/api/logout')

    // Clear user data if needed (e.g., tokens, localStorage, etc.)
    localStorage.clear()

    // Provide feedback to the user
    alert('You have been logged out successfully.')

    // Redirect to login or home page
    window.location.href = '/login'
  } catch (error) {
    console.error('Logout failed:', error)
    alert('Failed to log out. Please try again.')
  }
}
</script>

<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 lg:w-52 w-16 transition-[width]"
  >
    <!-- Top Bar -->
    <div class="flex h-16 items-center border-b px-2 lg:px-4 shrink-0 gap-1 justify-between">
      <Button variant="outline" size="icon" class="w-8 h-8">
        <iconify-icon icon="lucide:menu"></iconify-icon>
      </Button>

      <Button variant="outline" size="icon" class="w-8 h-8">
        <iconify-icon icon="lucide:plus"></iconify-icon>
      </Button>
    </div>

    <!-- Sidebar Links -->
    <nav class="flex flex-col gap-2 justify-between h-full relative">
      <div>
        <SidebarLink :links="links" />
      </div>

      <!-- Sign Out Button -->
      <div class="border-y text-center bg-background py-3">
        <button
          @click="handleLogOut"
          class="flex items-center w-full px-4 py-2 text-left hover:bg-muted transition"
        >
          <iconify-icon icon="lucide:log-out" class="mr-2"></iconify-icon>
          Sign Out
        </button>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
