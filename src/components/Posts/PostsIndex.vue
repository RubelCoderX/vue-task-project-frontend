<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'

const posts = ref([])
const getPosts = () => {
  axios
    .get('/api/posts')
    .then((response) => {
      posts.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })
}
onMounted(() => {
  getPosts()
})
</script>
<template>
  <div class="">
    <h1>All post</h1>
  </div>
</template>

<style scoped></style>
