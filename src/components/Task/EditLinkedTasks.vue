<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useTasksStore } from '@/stores/tasksStore';
import { MultiSelect } from 'primevue';

const formsStore = useFormsStore()
const tasksStore = useTasksStore()

const linkedTasks = ref([]);

onMounted(() => {
    const tasks = formsStore.task.linked_tasks.map(linkedTask => tasksStore.listViewTasks.find(task => task.id === linkedTask.link_id))

    console.log(tasksStore.listViewTasks)

    linkedTasks.value = tasks
})

const linkTasks = () => {

}

</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400">
            Linked tasks:
        </p>

        <form @submit="linkTasks">
            <MultiSelect
                v-model="linkedTasks"
                :options="tasksStore.listViewTasks"
                option-label="name"
                option-value="id"
                placeholder="Choose Tasks..."
            />

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
</template>