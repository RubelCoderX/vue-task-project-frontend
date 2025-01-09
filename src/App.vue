<script setup lang="ts">
import Sidebar from './components/Layout/Sidebar.vue'
import TopNavber from './components/Layout/TopNavber.vue'
</script>

<template>
  <Sidebar />
  <div class="flex flex-col lg:ml-52 ml-16 transition-[margin]">
    <TopNavber />
    <main>
      <RouterView />
    </main>
  </div>
</template>
