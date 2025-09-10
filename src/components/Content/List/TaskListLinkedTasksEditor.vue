<script setup>
import { MultiSelect } from 'primevue';
import { useTasksStore } from '@/stores/tasksStore';
import { watchEffect } from 'vue';

const tasksStore = useTasksStore()

const tasks = defineModel('tasks');

const showLinkedTask = (linkedTask) => {
    return tasksStore.listViewTasks.find(task => task.id === linkedTask.task_id)
}
</script>

<template>
    <MultiSelect
        v-model="tasks"
        :options="tasksStore.listViewTasks"
        option-label="name"
        option-value="id"
    >
        <template #value="{value}">
            <span v-for="linkedTask in value">{{ linkedTask.task_id ?? linkedTask.id }}</span>
        </template>
    </MultiSelect>
</template>