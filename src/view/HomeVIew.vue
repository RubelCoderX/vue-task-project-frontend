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

// Reactive variables
const tasks = ref<any[]>([]) // To hold task data
const error = ref<string | null>(null) // Error message
const loading = ref<boolean>(true) // Loading state
const showModal = ref(false) // Modal visibility state

// Fetch task data
onMounted(async () => {
  try {
    const response = await axiosInstance.get('/api/posts') // Replace with your API endpoint
    tasks.value = response.data.message.posts // Set task data
  } catch (err) {
    error.value = 'Error fetching tasks'
    console.error(err) // Log error
  } finally {
    loading.value = false // Set loading to false
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
            class: 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600',
            onClick: () => handleEdit(row.original.id),
          },
          'Edit',
        ),
        h(
          'button',
          {
            class: 'px-4 py-2 bg-yellow-500 text-white rounded hover:bg-blue-700',
            onClick: () => handleUpdate(row.original.id),
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
  console.log('Edit task:', task)
}

function handleDelete(taskId: number) {
  console.log('Delete task ID:', taskId)
}

function handleCreate(task: any) {
  console.log('Create new task:', task)
  showModal.value = true // Open modal
}

function handleUpdate(task: any) {
  console.log('Update task:', task)
}

// Create table instance
const table = useVueTable({
  get data() {
    return tasks.value // Bind to reactive task data
  },
  get columns() {
    return columns // Use predefined columns
  },
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-blue-600 mb-4">Task List</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-gray-500">Loading tasks...</div>

    <!-- Error State -->
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
  </div>
</template>
