<script setup>
import { useTasksStore } from '@/stores/tasksStore';
import { onRenderTriggered } from 'vue';

const props = defineProps({
    linkedTasks:{
        type: Array,
        required: true
    },

    task: {
        type: Object,
        required: true
    }
})

const linkedTasksRef = toRef(()=> props.linkedTasks)

const tasksStore = useTasksStore()

const linkedTasksInfo = ref([])

watchEffect(()=> {
    const tasksInfo = [];
    const linkedTasksIds = linkedTasksRef.value.map(linkedTask => linkedTask.link_id);

    tasksStore.listViewTasks.map(task => linkedTasksIds.includes(task.id) ? tasksInfo.push(task) : null)

    linkedTasksInfo.value = [...tasksInfo];
})

const openForm = inject('openForm')
</script>

<template>
    <div @click="() => openForm('EditLinkedTasks', task)">
        <div v-if="linkedTasksInfo.slice(1).length" class="flex gap-1 items-start">
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
                v-for="task in linkedTasksInfo.slice(1,2)"
            >
                {{ task.name.length > 6 ? task.name.slice(0,7) + '...' : task.name }}
            </div>
            <div
                class="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
                v-if="linkedTasks.slice(1).length - 1 > 0"
            >
                {{ `+${linkedTasks.slice(1).length - 1}` }}
            </div>
        </div>
        <div v-else class="!font-medium hover:text-gray-500 cursor-pointer border p-3 rounded-md w-[100px] text-center">Add +</div>
    </div>
</template>