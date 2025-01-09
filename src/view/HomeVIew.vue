<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import axiosInstance from '@/lib/axios'
import CreateModal from '@/components/Modal/CreateModal.vue'
import UpdateModal from '@/components/Modal/UpdateModal.vue'

// Reactive variables
const tasks = ref<any[]>([])
const error = ref<string | null>(null)
const loading = ref<boolean>(true)
const showModal = ref(false)
const showUpdateModal = ref(false)
const taskToEdit = ref<any>(null)

// Fetch task data
onMounted(async () => {
  try {
    const response = await axiosInstance.get('/api/posts')
    tasks.value = response.data.message.posts
  } catch (err) {
    error.value = 'Error fetching tasks'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Columns definition for the table
const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'title',
    header: () => 'Task Name',
    cell: ({ row }) => h('div', {}, row.getValue('title')),
  },
  {
    accessorKey: 'description',
    header: () => 'Description',
    cell: ({ row }) => h('div', {}, row.getValue('description')),
  },
  {
    accessorKey: 'due_date',
    header: () => 'Due Date',
    cell: ({ row }) => h('div', {}, row.getValue('due_date')),
  },
  {
    accessorKey: 'status',
    header: () => 'Status',
    cell: ({ row }) => h('div', {}, row.getValue('status')),
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) =>
      h('div', { class: 'flex space-x-2' }, [
        h(
          'button',
          {
            class: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700',
            onClick: () => handleCreate(row.original),
          },
          'Create',
        ),

        h(
          'button',
          {
            class: 'px-4 py-2 bg-yellow-500 text-white rounded hover:bg-blue-700',
            onClick: () => handleEdit(row.original),
          },
          'Update',
        ),
        h(
          'button',
          {
            class: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600',
            onClick: () => handleDelete(row.original.id),
          },
          'Delete',
        ),
      ]),
  },
]

// Edit and Delete handlers

function handleEdit(task: any) {
  taskToEdit.value = task

  showUpdateModal.value = true
}

function handleDelete(taskId: number) {
  axiosInstance.delete(`/api/posts/${taskId}`)
  alert('Task deleted successfully')
}

function handleCreate(task: any) {
  console.log('Create new task:', task)
  showModal.value = true
}

// Create table instance
const table = useVueTable({
  get data() {
    return tasks.value
  },
  get columns() {
    return columns
  },
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-blue-600 text-2xl font-semibold mb-4">Total Task List</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-gray-500">Loading tasks...</div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- Table -->
    <div v-if="!loading && !error" class="border rounded-md">
      <Table>
        <!-- Table Header -->
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>

        <!-- Table Body -->
        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No tasks available.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Modal for creating a new task -->
    <CreateModal :showModal="showModal" @update:showModal="showModal = $event" />
    <UpdateModal
      :task="taskToEdit"
      :showModal="showUpdateModal"
      @update:showModal="showUpdateModal = $event"
    />
  </div>
</template>
