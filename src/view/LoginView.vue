<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import axiosInstance from '@/lib/axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const formData = ref({
  email: '',
  password: '',
})
const error = ref<string | null>(null)
const isLoading = ref(false)

const router = useRouter()

const handleSubmit = async () => {
  error.value = null
  isLoading.value = true
  try {
    // Ensure CSRF cookie is set
    await axiosInstance.get('/sanctum/csrf-cookie')

    const response = await axiosInstance.post('/api/login', formData.value)

    // Check if response is successful and contains the token
    if (response.data.status === 'success' && response.data.token) {
      const token = response.data.token
      const token_type = response.data.token_type

      // Save token to localStorage
      localStorage.setItem('token', `${token_type} ${token}`)
    }

    // Show success message
    error.value = response.data.message
    // Redirect to dashboard on success
    router.push('/')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('Error during login:', e)

    // Set error message from Axios interceptor
    if (e.message) {
      error.value = e.message
    } else {
      error.value = 'An unknown error occurred.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center -mt-20 min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="handleSubmit">
          <!-- Email Input -->
          <div class="grid gap-2">
            <Label for="email" class="text-left">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="johndoe19@example.com"
              required
              v-model="formData.email"
            />
          </div>
          <!-- Password Input -->
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="#" class="inline-block ml-auto text-xs underline">Forgot your password?</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              v-model="formData.password"
            />
          </div>
          <!-- Error Message -->
          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
          <!-- Submit Button -->
          <Button :disabled="isLoading" type="submit" class="w-full">
            <span v-if="!isLoading">Login</span>
            <span v-else>Loading...</span>
          </Button>
        </form>
        <div class="mt-4 text-sm text-center">
          Don't have an account?
          <RouterLink to="/register" class="underline">Register</RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
