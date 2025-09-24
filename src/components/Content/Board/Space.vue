<script setup>
import axiosIns from '@/axios';
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import ToDoTasks from './ToDoTasks.vue';

const spaceStore = useSpaceStore();
const tasksStore = useTasksStore();

onMounted(() => {
    const spaceId = spaceStore.currentSpace.id;

    if(spaceId in tasksStore.spaceTasks){
        axiosIns
        .get(`space/${spaceId}/view`)
        .then(res => {
            const boardView = res.data.views[1].id;

            axiosIns
                .get(`view/${boardView}/task`)
                .then(res => {
                    tasksStore.spaceTasks[spaceId] = res.data.tasks;
                })
        })
    }
})

</script>

<template>
    <ToDoTasks />
</template>