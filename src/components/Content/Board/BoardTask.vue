<script setup>
import {PlusIcon} from '@heroicons/vue/24/outline';
import { PencilIcon, CheckIcon, PlayIcon } from '@heroicons/vue/24/solid';
import { useElementHover } from '@vueuse/core'
import { useTemplateRef, watch} from 'vue'
import { useTasksStore } from '@/stores/tasksStore';
import { InputText } from 'primevue';
import SubTasksCreateForm from './SubTasksCreateForm.vue';
import BoardTaskDatePicker from './BoardTaskDatePicker.vue';

const {task} = defineProps({
    task:{
        type: Object,
        required: true,
    }
})

const emit = defineEmits(['task-completed'])

const tasksStore = useTasksStore();

const boardTaskRef = useTemplateRef('boardTaskRef')
const isHovered = useElementHover(boardTaskRef)

const taskData = reactive({...task});

watch(() => task, () => Object.assign(taskData, task))

const open = ref(false);
const editMode = ref(false);
const newSubTaskFormOpen = ref(false)

watch(editMode, (newVal) => {
    if(!newVal){
        if(taskData.name !== task.name) renameTask()
    }
})

const toggleOpen = () => open.value = !open.value;

const toggleFormOpen = () => {
    open.value = true;
    newSubTaskFormOpen.value = !newSubTaskFormOpen.value;
}

const completeTask = () => {
    emit('task-completed', task.id)

    tasksStore.editTask(task, {status: 'complete'})
}

const renameTask = () => {
    tasksStore.editTask(task, {name: taskData.name})
}

const optimisticallyCompleteSubTask = (id) => {
    taskData.subtasks = taskData.subtasks.filter(subtask => subtask.id !== id);
    taskData.subtasks_count = taskData.subtasks.length
}

const optimisticallyChangeDates = (dates) => {

    const {start_date, due_date} = dates;

    taskData.start_date = start_date;
    taskData.due_date = due_date;
}

</script>

<template>
    <div class="rounded-md w-full border-2 border-gray-400" ref="boardTaskRef">
        <div class="flex justify-between relative p-2 !mb-5 text-sm">
            <div>
                <div v-if="editMode">
                    <InputText @vue:mounted="e => e.el.focus()" @blur="editMode = false" v-model="taskData.name" />
                </div>
                <span class="!font-medium" v-else >{{ taskData.name }}</span>
            </div>
            <div
                v-if="isHovered && !editMode"
                class="absolute top-1 right-1 rounded-md border border-gray-600 flex gap-1 items-center p-1"
            >
                <button @click="completeTask" v-if="task.status.status == 'to do'" class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <check-icon v-tooltip="`Mark Complete`" class="w-4.5 h-4.5" />
                </button>

                <button @click="toggleFormOpen" v-if="!task.top_level_parent" class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <plus-icon v-tooltip="`Add Subtask`" class="w-4.5 h-4.5" />
                </button>

                <button @click="() => editMode = true" class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <pencil-icon v-tooltip="`Rename`" class="w-4.5 h-4.5" />
                </button>
            </div>
        </div>

        <div class="p-2">
            <BoardTaskDatePicker @dates-changed="(dates) => optimisticallyChangeDates(dates)" :task="taskData" />
        </div>

        <div v-if="taskData.subtasks_count" class="p-0.5">
            <button @click="toggleOpen" class="cursor-pointer w-full rounded-md hover:bg-gray-600 text-xs flex gap-1 items-center p-1">
                <play-icon ref="toggler" class="w-3 h-3 transition" :class="{'rotate-90': open}" />
                <span>Subtasks: {{ taskData.subtasks_count ?? taskData.subtasks.length }}</span>
            </button>
        </div>
    </div>

    <div v-if="open" class="pl-3 w-full !space-y-0.75">
        <BoardTask v-for="task in taskData.subtasks" :task="task" :key="task.id" @task-completed="(id) => optimisticallyCompleteSubTask(id)" />
        <SubTasksCreateForm v-if="newSubTaskFormOpen" :task="task" @close="toggleFormOpen" />
    </div>
</template>