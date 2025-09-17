<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useTasksStore } from '@/stores/tasksStore';
import Listbox from 'primevue/listbox';

const formsStore = useFormsStore()
const tasksStore = useTasksStore()

const linkedTasks = ref([]);

onMounted(() => {
    const links = formsStore.task.linked_tasks.map(link => link.link_id)
    const ids = formsStore.task.linked_tasks.map(link => link.task_id)

    const tasks = tasksStore.allTasks.filter(task => links.includes(task.id) || ids.includes(task.id))

    linkedTasks.value = tasks.map(task => task.id)
})

const toggleLink = (task, linked) => {

}

</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400">
            Linked tasks:
        </p>

        <Listbox
            v-model="linkedTasks"
            :options="tasksStore.allTasks"
            placeholder="Choose Tasks..."
            option-label="name"
            option-value="id"
            multiple
        >
            <template #option="{option, selected}"><span @click="">{{ option.name }}</span></template>
        </Listbox>
    </div>
</template>