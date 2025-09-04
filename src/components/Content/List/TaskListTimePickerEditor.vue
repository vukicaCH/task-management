<script setup>
import dayjs from 'dayjs';
import DatePicker from 'primevue/datepicker';
import axiosIns from '@/axios';
import { useTasksStore } from '@/stores/tasksStore';

const props = defineProps({
    task:{
        type: Object,
        required: true,
    },

    field:{
        type: String,
        required: true,
    },

    dateValue:{
        type: String,
        required: true
    }
})

const date = ref(props.dateValue)

const emit = defineEmits(['close'])

const tasksStore = useTasksStore();

watch(() => date.value, () => {
    if(date.value){
        const dateNum = dayjs(date.value).valueOf()

        tasksStore.loading = true;
        tasksStore.listId = props.task.list.id;

        axiosIns
            .put(`task/${props.task.id}`,{[props.field]: dateNum})
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
    }
})

const clearDueDate = () => {
    tasksStore.loading = true;
    tasksStore.listId = props.task.list.id;

    axiosIns
        .put(`task/${props.task.id}`,{[props.field]: null})
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
}
</script>

<template>
    <DatePicker
        v-model="date"
        dateFormat="dd/mm/yy"
        show-button-bar
        show-icon
        @hide="emit('close')"
        @clear-click="clearDueDate"
        :clear-button-props="{hidden: !date}"
    />
</template>