<script setup lang="ts">
import { ref, defineProps, defineEmits, watchEffect } from 'vue'
import Input from '../ui/input/Input.vue'
import Button from '../ui/button/Button.vue'
import Textarea from '../ui/textarea/Textarea.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import axiosInstance from '@/lib/axios'

const props = defineProps({
  showModal: Boolean,
  task: Object,
})

console.log('tasks', props.task)
const emit = defineEmits(['update:showModal'])

const updatedTask = ref({
  title: '',
  description: '',
  due_date: '',
  status: 'pending',
})

const loading = ref(false)

const closeModal = () => {
  emit('update:showModal', false)
  resetForm()
}

const resetForm = () => {
  updatedTask.value = { title: '', description: '', due_date: '', status: 'pending' }
}
console.log('Task to update:', props?.task?.id)

// Watch for changes to the task prop and update the form values accordingly
watchEffect(() => {
  if (props.task) {
    updatedTask.value = {
      title: props.task.title || '',
      description: props.task.description || '',
      due_date: props.task.due_date || '',
      status: props.task.status || 'pending',
    }
  }
})

const handleSubmit = async () => {
  loading.value = true

  try {
    const res = await axiosInstance.put(`/api/posts/${props?.task?.id}`, updatedTask.value)
    console.log('res', res)

    alert('Task updated successfully!')
    closeModal()
  } catch (error) {
    console.error('Error updating task:', error)
    alert('Error updating task. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
  >
    <div class="bg-black w-1/2 p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">Update Task</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium">Task Title</label>
          <Input
            v-model="updatedTask.title"
            id="title"
            type="text"
            class="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div class="mb-4">
          <label for="description" class="block text-sm font-medium">Description</label>
          <Textarea
            v-model="updatedTask.description"
            id="description"
            class="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div class="mb-4">
          <label for="due_date" class="block text-sm font-medium">Due Date</label>
          <Input
            v-model="updatedTask.due_date"
            id="due_date"
            type="date"
            class="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div class="mb-4">
          <label for="status" class="block text-sm font-medium">Status</label>
          <Select v-model="updatedTask.status">
            <SelectTrigger>
              <SelectValue :placeholder="'Select status'" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="flex justify-end space-x-2">
          <Button
            type="button"
            class="px-4 py-2 bg-gray-500 text-white rounded"
            @click="closeModal"
          >
            Cancel
          </Button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded"
            :disabled="loading.value"
          >
            {{ loading.value ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Add basic styling for the modal */
</style>
