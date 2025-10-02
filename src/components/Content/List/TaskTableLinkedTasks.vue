<script setup>
import { useTasksStore } from '@/stores/tasksStore';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})

const tasksStore = useTasksStore()

const taskData = toRef(() => props.task)

const linkedTasks = computed(() => {
    const links = taskData.value.linked_tasks
    const ids = new Set(links.flatMap(({ task_id, link_id }) => [task_id, link_id]))

    return tasksStore.allTasks.filter(task => ids.has(task.id))
})

const firstTwoTasks = computed(() => linkedTasks.value.slice(0,2) ?? linkedTasks.value)
const restTasks = computed(() => linkedTasks.value.slice(2))

const openForm = inject('openForm')
</script>

<template>
    <div @click="() => openForm('EditLinkedTasks', task)">
        <div v-if="linkedTasks.length" class="flex gap-1 items-start">
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
                v-for="task in firstTwoTasks"
            >
                {{ task.name.length > 6 ? task.name.slice(0,7) + '...' : task.name }}
            </div>
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
                v-if="restTasks.length"
            >
                {{ `+${restTasks.length}` }}
            </div>
        </div>
        <div v-else class="!font-medium hover:text-gray-500 cursor-pointer border p-3 rounded-md w-[100px] text-center">Add +</div>
    </div>
</template>