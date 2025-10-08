<script setup>
import { useTasksStore } from '@/stores/tasksStore'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const props = defineProps({
    task:{
        type: Object,
        required: true
    }
})

const tasksStore = useTasksStore()

const emit = defineEmits(['close', 'subtask-created'])

const taskName = ref('')

const target = useTemplateRef('target')
const inputText = useTemplateRef('input')

onMounted(() => inputText.value.focus())

onClickOutside(target, () => emit('close'))

const createSubtask = () => {

    const {list, id} = props.task;

    tasksStore
        .createTask(list.id, {name: taskName.value}, id)

    taskName.value = ''
}
</script>

<template>
    <div class="rounded-md w-full p-1 bg-gray-800" ref="target">
        <div class="flex justify-between">
            <input v-model="taskName" ref="input" class="focus:ring-0 focus:outline-none" placeholder="Subtask Name..."/>
            <button
                class="bg-white text-black py-1 px-2 rounded-md !font-medium disabled:bg-gray-400"
                :disabled="!taskName"
                @click="createSubtask"
            >
                Save
            </button>
        </div>
    </div>
</template>