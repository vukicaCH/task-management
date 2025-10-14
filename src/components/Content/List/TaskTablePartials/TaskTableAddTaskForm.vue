<script setup>
import Button from 'primevue/button';
import { useTasksStore } from '@/stores/tasksStore';

const {top_level_parent, list_id} = defineProps({
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

const loading = ref(false)

const createTask = (e) => {
    e.preventDefault();

    loading.value = true;

    tasksStore
        .createTask(list_id, {name: taskName.value}, top_level_parent)
        .then(() => loading.value = false)
    
    taskName.value = ''
    input.value.focus()
}

const handleCancelClick = () => {
    if(!top_level_parent) emit('close')
    else editMode.value = false
}
</script>

<template>
    <div class="relative w-full h-[50px]">
        <div class="absolute">
            <form v-if="editMode || !top_level_parent" class="flex gap-2" @submit="(e) => createTask(e)">
                <input
                    class="focus:ring-0 focus:outline-none border-b"
                    v-model="taskName"
                    ref="input"
                    @vue:mounted="(input) => input.el.focus()"
                    placeholder="Task Name"
                    :disabled="loading"
                />
                <Button
                    severity="secondary"
                    label="Cancel"
                    @click="handleCancelClick"
                    :disabled="loading"
                />
                <Button
                    severity="contrast"
                    :label="loading ? '...' : 'Submit'"
                    :disabled="loading"
                    type="submit"
                />
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