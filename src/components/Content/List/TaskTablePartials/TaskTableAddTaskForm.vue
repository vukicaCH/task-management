<script setup>
import { InputText } from 'primevue';
import Button from 'primevue/button';
import { useTasksStore } from '@/stores/tasksStore';
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

const editMode = ref(false);

const tasksStore = useTasksStore()

const taskName = ref('');

const input = ref();

const createTask = async (e) => {

    e.preventDefault();

    const data = {name: taskName.value};

    if(props.top_level_parent) data.parent = props.top_level_parent;

    await tasksStore.createTask(props.list_id, data)
    
    taskName.value = ''

}

const handleCancelClick = () => {
    if(!props.top_level_parent) emit('close')
    else editMode.value = false
}
</script>

<template>
    <div class="relative w-full h-[50px]">
        <div class="absolute">
            <form v-if="editMode || !top_level_parent" class="flex gap-2" @submit="(e) => createTask(e)">
                <InputText
                    v-model="taskName"
                    ref="input"
                    @vue:mounted="(input) => input.el.focus()"
                    placeholder="Task Name"
                />
                <Button severity="secondary" label="Cancel" @click="handleCancelClick" />
                <Button severity="contrast" label="Submit" type="submit" />
            </form>
            <div v-else>
                <Button
                    severity="secondary"
                    outlined
                    @click="editMode = true"
                >
                    + Add Task
                </Button>
            </div>
        </div>
    </div>
</template>