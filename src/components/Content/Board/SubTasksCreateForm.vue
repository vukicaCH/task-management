<script setup>
import axiosIns from '@/axios'
import { useTasksStore } from '@/stores/tasksStore'
import { useViewsStore } from '@/stores/viewsStore'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const props = defineProps({
    task:{
        type: Object,
        required: true
    }
})

const tasksStore = useTasksStore()
const viewsStore = useViewsStore()

const emit = defineEmits('close')

const taskName = ref('')

const target = useTemplateRef('target')
const inputText = useTemplateRef('input')

onMounted(() => inputText.value.focus())

onClickOutside(target, () => emit('close'))

const createSubtask = async () => {

    const {list, id} = props.task;

    axiosIns
        .post(`list/${list.id}/task`,{name: taskName.value, parent: id})
        .then(res => {
            const view = {...viewsStore.currentView};
            tasksStore.hydrateSpaceTasks(view)
        })
        .finally(() => {
            taskName.value = ''
        })
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