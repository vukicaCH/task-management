<script setup>
import { DataTable } from 'primevue';
import Column from 'primevue/column';
import {InputText} from 'primevue';
import { useTasksStore } from '@/stores/tasksStore';
import { useFormsStore } from '@/stores/formsStore';
import dayjs from 'dayjs';
import TaskStatusSelect from './TaskStatusSelect.vue';
import { PencilSquareIcon, CalendarDaysIcon } from '@heroicons/vue/24/solid';
import TaskListTimePickerEditor from './TaskListTimePickerEditor.vue';
import TaskListLinkedTasks from './TaskListLinkedTasks.vue';
import TaskListTagsEditor from './TaskListTagsEditor.vue';
import { provide } from 'vue';
import { Select } from 'primevue';
import _ from 'lodash';
import TaskListPriority from './TaskListPriority.vue';

const props = defineProps({
    listId:{
        type: String,
        required: true
    },
})

const tasksStore = useTasksStore();
const formsStore = useFormsStore();

const tasks = computed(() => {
    if(props.listId in tasksStore.tasks){
        return tasksStore.tasks[props.listId].map(task => {
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

    return []
})

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

const customFields = [
    'linked_tasks',
    'tags'
]

const stopClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
}

const editingRows = ref([])

const onRowEditSave = (event) => {
    let { newData, index } = event;

    const changedTask = {...tasks.value[index]};

    if(_.isEqual(newData, changedTask)) return

    tasks.value[index] = newData

    tasksStore.editTask(newData)
};

const openEditor = (e, field, editorInitCallback) => {
    if(readOnlyFields.includes(field)) stopClick(e)
    else if(customFields.includes(field)) return
    else editorInitCallback(e)
}

const openForm = (formName, task) => {
    formsStore.toggleForm(formName);
    formsStore.$patch({task})
}

provide('openForm', openForm)
</script>

<template>
    <DataTable
        v-model:editingRows="editingRows"
        :value="tasks"
        :loading="loading"
        editMode="row"
        @row-edit-save="onRowEditSave"
        columnResizeMode="expand"
    >
        <Column
            :rowEditor="true"
            align-frozen="left"
            frozen
        >
        </Column>
        <Column v-for="col in tasksStore.columns" :field="col" :header="getColHeader(col)">
            <template #body="{data, field, editorInitCallback}">
                <div
                    :class="{
                         'cursor-not-allowed' : readOnlyFields.includes(field),
                         'rounded-md cursor-pointer border border-transparent py-2 px-1 hover:border-white' :  !readOnlyFields.includes(field) && !customFields.includes(field)
                    }"
                    class="relative"
                    @click="(e) => openEditor(e, field, editorInitCallback)"
                >
                    <div>
                        <div v-if="field.includes('date')">
                            <span v-if="data[field]">{{ data[field] }}</span>
                            <div
                                v-else
                                v-tooltip="'Date Not Defined'"
                                class="flex items-center"
                                :class="{'text-red-300' : readOnlyFields.includes(field)}"
                            >
                                <CalendarDaysIcon
                                    class="w-5 h-5"
                                />
                                <span class="!font-bold">DND</span>
                            </div>
                        </div>
                        <div v-else-if="field === 'status'">
                            {{ data[field].status }}
                        </div>
                        <div v-else-if="field === 'linked_tasks'">
                            <TaskListLinkedTasks :task="data" />
                        </div>
                        <div v-else-if="field === 'creator'">
                            {{ data[field].username }}
                        </div>
                        <div v-else-if="field === 'archived'">
                            <span>{{ data[field] ? 'Yes' : 'No' }}</span>
                        </div>
                        <div v-else-if="field === 'tags'">
                            <TaskListTagsEditor :tags="data[field]" />
                        </div>
                        <div v-else-if="field === 'priority'">
                            <TaskListPriority v-model:priority="data[field]" />
                        </div>
                        <div v-else>{{ data[field] }}</div>
                    </div>
                    <div
                        v-if="!readOnlyFields.includes(field) && !['linked_tasks','tags'].includes(field)"
                        class="bg-gray-500 opacity-0 hover:opacity-50 absolute top-0 right-0 w-full h-full overflow-hidden rounded-md flex items-center justify-end pr-2"
                    >
                        <PencilSquareIcon class="w-5 h-5" />
                    </div>
                </div>
            </template>
            <template #editor="{data, field}">
                <div v-if="field.includes('date')">
                    <TaskListTimePickerEditor class="!w-[200px]" v-model:date="data[field]" :disabled="readOnlyFields.includes(field)" />
                </div>
                <div v-else-if="field === 'status'">
                    <TaskStatusSelect v-model:status="data[field]" :task="data" />
                </div>
                <div v-else-if="field === 'linked_tasks'">
                    <TaskListLinkedTasks :task="data" />
                </div>
                <div v-else-if="field === 'tags'">
                    <TaskListTagsEditor :tags="data[field]" />
                </div>
                <div v-else-if="field === 'creator'">
                    {{ data[field].username }}
                </div>
                <div v-else-if="field === 'archived'">
                    <Select
                        v-model="data[field]"
                        :options="[{label: 'Yes', value: true},{label: 'No', value: false} ]"
                        option-label="label"
                        option-value="value"
                    />
                </div>
                <div v-else-if="field === 'priority'">
                    <TaskListPriority v-model:priority="data[field]" :edit-mode="true" />
                </div>
                <div v-else>
                    <InputText v-model="data[field]" />
                </div>
            </template>
        </Column>
        <template #empty>No tasks for this list.</template>
    </DataTable>
</template>