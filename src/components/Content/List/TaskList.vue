<script setup>
import { DataTable } from 'primevue';
import Column from 'primevue/column';
import {InputText} from 'primevue';
import { useTasksStore } from '@/stores/tasksStore';
import dayjs from 'dayjs';
import TaskStatusSelect from './TaskStatusSelect.vue';
import TaskListLinkedTasksEditor from './TaskListLinkedTasksEditor.vue';
import { Bars3BottomLeftIcon } from '@heroicons/vue/24/solid';
import { Dialog } from 'primevue';
import TaskListTimePickerEditor from './TaskListTimePickerEditor.vue';
import TaskListLinkedTasks from './TaskListLinkedTasks.vue';

const props = defineProps({
    listId:{
        type: String,
        required: true
    },
})

const tasksStore = useTasksStore();

const tasks = ref([])

watch(()=> tasksStore.tasks, ()=> {
    if(props.listId in tasksStore.tasks){
        tasks.value = tasksStore.tasks[props.listId].map(task => {
            const newTask = {};

            Object.keys(task).forEach(key => {
                if(key.includes('date')){
                    newTask[key] = task[key] ? dayjs(Number(task[key])).format('DD/MM/YYYY') : null
                }else{
                    newTask[key] = task[key]
                }
            })

            return newTask
        })
    }
},{deep: true})

const loading = computed(() => tasksStore.loading && props.listId === tasksStore.listId)

const getColHeader = (col) => {
    return col.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const readOnlyFields = [
    'date_done',
    'date_updated',
    'date_closed',
    'date_created',
    'creator'
]

const visible = ref(false)
const currentTask = ref();

const openDescriptionDialog = (e, task) => {
    e.stopPropagation()
    currentTask.value = task;
    visible.value = true;
}

const stopClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
}

const editingRows = ref([])

const onRowEditSave = (event) => {
    let { newData, index } = event;

    tasks.value[index] = newData
};
</script>

<template>
    <DataTable
        v-model:editingRows="editingRows"
        :value="tasks"
        :loading="loading"
        editMode="row"
        @row-edit-save="onRowEditSave"
    >
        <Column :rowEditor="true"></Column>
        <Column v-for="col in tasksStore.columns" :field="col" :header="getColHeader(col)">
            <template #body="{data, field}">
                <div v-if="['due_date', 'start_date'].includes(field)">
                    <span v-if="data[field]">{{ data[field] }}</span>
                    <span v-else>Add +</span>
                </div>
                <div v-else-if="field === 'status'">
                    {{ data[field].status }}
                </div>
                <div v-else-if="field === 'linked_tasks'">
                    <TaskListLinkedTasks :linkedTasks="data[field]" />
                </div>
                <div v-else-if="field === 'creator'">
                    {{ data[field].username }}
                </div>
                <div v-else-if="field === 'archived'">
                    <span>{{ data[field] ? 'Yes' : 'No' }}</span>
                </div>
                <div v-else-if="field === 'tags'">
                    <span>TAGS BABY</span>
                </div>
                <div v-else>{{ data[field] }}</div>
            </template>
            <template #editor="{data, field}">
                <div v-if="['due_date', 'start_date'].includes(field)">
                    <TaskListTimePickerEditor v-model:date="data[field]" />
                </div>
                <div v-else-if="field === 'status'">
                    <TaskStatusSelect v-model:status="data[field]" :task="data" />
                </div>
                <div v-else-if="field === 'linked_tasks'">
                    <TaskListLinkedTasks :linkedTasks="data[field]" :open-edit-linked-tasks="true" />
                </div>
                <div v-else>
                    <InputText v-model="data[field]" />
                </div>
            </template>
        </Column>
        <template #empty>No tasks for this list.</template>
    </DataTable>


    <Dialog v-model:visible="visible" modal header="Description">
        <p>{{ currentTask.description }}</p>
    </Dialog>
</template>