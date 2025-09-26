<script setup>
import { CalendarIcon, PlusIcon} from '@heroicons/vue/24/outline';
import { PencilIcon, CheckIcon, PlayIcon } from '@heroicons/vue/24/solid';
import { useElementHover } from '@vueuse/core'
import { useTemplateRef, watch} from 'vue'
import { useTasksStore } from '@/stores/tasksStore';
import { InputText } from 'primevue';

const props = defineProps({
    task:{
        type: Object,
        required: true,
    }
})

const tasksStore = useTasksStore();

const boardTaskRef = useTemplateRef('boardTaskRef')
const isHovered = useElementHover(boardTaskRef)

const taskName = ref(props.task.name)

const open = ref(false);
const editMode = ref(false);

watch(editMode, (newVal) => {
    if(!newVal){
        if(taskName.value !== props.task.name) renameTask()
    }
})

const toggleOpen = () => open.value = !open.value;

const completeTask = () => tasksStore.editTask(props.task.id, {status: 'complete'})

const renameTask = () => tasksStore.editTask(props.task.id, {name: taskName.value})

</script>

<template>
    <div class="rounded-md w-full bg-gray-800" ref="boardTaskRef">
        <div class="flex justify-between relative p-2 !mb-5 text-sm">
            <div>
                <div v-if="editMode">
                    <InputText @vue:mounted="e => e.el.focus()" @blur="editMode = false" v-model="taskName" />
                </div>
                <div v-else>{{ task.name }}</div>
            </div>
            <div
                v-if="isHovered"
                class="absolute top-1 right-1 rounded-md border border-gray-600 flex gap-1 items-center p-1"
            >
                <button @click="completeTask" v-if="task.status.status == 'to do'" class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <check-icon v-tooltip="`Mark Complete`" class="w-4.5 h-4.5" />
                </button>

                <button class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <plus-icon v-tooltip="`Add Subtask`" class="w-4.5 h-4.5" />
                </button>

                <button @click="editMode = true" class="cursor-pointer rounded hover:bg-gray-500 p-1">
                    <pencil-icon v-tooltip="`Rename`" class="w-4.5 h-4.5" />
                </button>
            </div>
        </div>

        <div class="p-2">
            <button class="cursor-pointer rounded border border-gray-600 hover:bg-gray-700 p-1">
                <calendar-icon class="w-4 h-4" />
            </button>
        </div>

        <div v-if="task.subtasks" class="p-0.5">
            <button @click="toggleOpen" class="cursor-pointer w-full rounded-md hover:bg-gray-600 text-xs flex gap-1 items-center p-1">
                <play-icon ref="toggler" class="w-3 h-3 transition" :class="{'rotate-90': open}" />
                <span>Subtasks: {{ task.subtasks_count ?? task.subtasks.length }}</span>
            </button>
        </div>
    </div>

    <div v-if="open">
        <div class="rounded-md pl-3 w-full !space-y-0.75">
            <BoardTask v-for="task in task.subtasks" :task="task" :key="task.id" />
        </div>
    </div>
</template>