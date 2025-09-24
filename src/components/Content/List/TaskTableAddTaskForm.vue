<script setup>
import { InputText } from 'primevue';
import Button from 'primevue/button';
import { useTasksStore } from '@/stores/tasksStore';
import { onClickOutside } from '@vueuse/core'
import axiosIns from '@/axios';

const props = defineProps({
    top_level_parent: {
        type: String,
        required: false,
    },

    list_id:{
        type: String,
        required: true
    }
})

const emit = defineEmits(['close'])

const tasksStore = useTasksStore()

const taskName = ref('');

const input = ref();

const createTask = (e) => {

    e.preventDefault();

    const data = {name: taskName.value};

    if(props.top_level_parent) data.parent = props.top_level_parent;

    axiosIns
        .post(`list/${props.list_id}/task`, data)
        .then(res => {
            tasksStore.tasks[props.list_id] = [...tasksStore.tasks[props.list_id], res.data]
        })
        .finally(()=> taskName.value = '')

}

onMounted(()=> input.value.$el.focus())
</script>

<template>
    <div class="relative w-full h-[50px]">
        <div class="absolute">
            <form class="flex gap-2" @submit="(e) => createTask(e)">
                <InputText
                    v-model="taskName"
                    ref="input"
                    placeholder="Task Name"
                />
                <Button severity="secondary" @click="emit('close', top_level_parent)" label="Cancel" />
                <Button severity="contrast" label="Submit" type="submit" />
            </form>
        </div>
    </div>
</template>