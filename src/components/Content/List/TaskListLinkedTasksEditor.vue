<script setup>
import { MultiSelect } from 'primevue';
import { useTasksStore } from '@/stores/tasksStore';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    task:{
        type: Object,
        required: true
    }
})

const linkedTasks = defineModel('linkedTasks')

const tasksStore = useTasksStore()
const spaceStore = useSpaceStore()

const tasks = computed(() => {
    return tasksStore.tasks[props.task.list.id]
})
</script>

<template>
    <MultiSelect
        v-model="linkedTasks"
        :options="tasks"
        option-label="name"
    />
</template>