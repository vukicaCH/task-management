<script setup>
import { Select } from 'primevue';
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import axiosIns from '@/axios';

const props = defineProps({
    task:{
        type: Object,
        required: true,
    },

    statusValue:{
        type: String,
        required: true,
    }
})

const emit = defineEmits(['close'])

const status = ref(props.statusValue)

const spaceStore = useSpaceStore();
const tasksStore = useTasksStore();

const taskSpace = computed(() => spaceStore.spaces.find(space => space.id === props.task.space.id));

const options = computed(() => taskSpace.value.statuses)

watch(status, ()=>{
    tasksStore.loading = true;
    tasksStore.listId = props.task.list.id;

    axiosIns
        .put(`task/${props.task.id}`,{status: status.value})
        .then((res) => {
            const editedTask = res.data;
            const listId = editedTask.list.id;

            tasksStore.tasks[listId] = tasksStore.tasks[listId].map(task => {
                if(task.id !== editedTask.id) return task;

                return editedTask
            })

            emit('close')

            tasksStore.loading = false;
            tasksStore.listId = null;
        })
})
</script>

<template>
    <Select
        v-model="status"
        :options="options"
        option-value="status"
        option-label="status"
    />
</template>