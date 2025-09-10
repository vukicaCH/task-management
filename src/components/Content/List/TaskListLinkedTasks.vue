<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { useFormsStore } from '@/stores/formsStore';

const props = defineProps({
    linkedTasks:{
        type: Array,
        required: true
    },

    openEditLinkedTasks:{
        type: Boolean,
        required: false,
        default: false,
    }
})

const formsStore = useFormsStore()

const linkedTasksRef = toRef(()=> props.linkedTasks)

const tasksStore = useTasksStore()

const linkedTasksInfo = ref([])

watchEffect(()=> {
    const tasksInfo = [];
    const linkedTasksIds = linkedTasksRef.value.map(linkedTask => linkedTask.task_id);

    tasksStore.listViewTasks.map(task => linkedTasksIds.includes(task.id) ? tasksInfo.push(task) : null)

    linkedTasksInfo.value = [...tasksInfo];
})

const openEditLinkedTasksForm = () => {
    formsStore.toggleForm('EditLinkedTasks')
}
</script>

<template>
    <div @click="() => { if(openEditLinkedTasks) openEditLinkedTasksForm() }">
        <div v-if="linkedTasksInfo.length" class="flex gap-1">
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-700"
                :class="{'hover:bg-gray-400 cursor-pointer' : openEditLinkedTasks}"
                v-for="task in linkedTasksInfo.slice(0,2)"
            >
                {{ task.name }}
            </div>
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-700"
                :class="{'hover:bg-gray-400 cursor-pointer' : openEditLinkedTasks}"
                v-if="linkedTasks.slice(1).length"
            >
                {{ `+${linkedTasks.slice(1).length - 1}` }}
            </div>
        </div>
        <div v-else :class="{'!font-medium hover:text-gray-500 cursor-pointer border p-3 rounded-md' : openEditLinkedTasks}">Add +</div>
    </div>
</template>