<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useTasksStore } from '@/stores/tasksStore';
import Listbox from 'primevue/listbox';
import _ from 'lodash';

const formsStore = useFormsStore()
const tasksStore = useTasksStore()

const linkedTasks = ref([]);

onMounted(() => {
    const links = formsStore.task.linked_tasks.map(link => link.link_id)
    const ids = formsStore.task.linked_tasks.map(link => link.task_id)

    const tasks = tasksStore.allTasks.filter(task => links.includes(task.id) || ids.includes(task.id))

    linkedTasks.value = tasks.map(task => task.id)
})

</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400 !mb-3">
            Linked tasks for <i>"{{ formsStore.task.name }}"</i>:
        </p>

        <Listbox
            v-model="linkedTasks"
            :options="tasksStore.allTasks"
            placeholder="Choose Tasks..."
            option-label="name"
            option-value="id"
            multiple
            :option-disabled="(option) => option.id === formsStore.task.id"
        >
            <template #option="{option, selected}">
                <div class="w-full" @click="() => tasksStore.toggleTaskLink(option.id, formsStore.task.id, selected)">{{ option.name }} ({{ option.id }})</div>
            </template>
        </Listbox>
    </div>
</template>