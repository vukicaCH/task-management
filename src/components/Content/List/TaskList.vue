<script setup>
import { DataTable } from 'primevue';
import Column from 'primevue/column';
import {InputText} from 'primevue';
import { useTasksStore } from '@/stores/tasksStore';
import dayjs from 'dayjs';
import TaskListTimePickerEditor from './TaskListTimePickerEditor.vue';
import TaskStatusSelect from './TaskStatusSelect.vue';
import axiosIns from '@/axios';
import { Bars3BottomLeftIcon } from '@heroicons/vue/24/solid';
import { Dialog } from 'primevue';

const props = defineProps({
    listId:{
        type: String,
        required: true
    },
})

const tasksStore = useTasksStore();

const tasks = ref()

watch(tasksStore.tasks, ()=>{
    tasks.value = tasksStore.tasks[props.listId]
    
    // ?.map(task => {
    //     const due_date = task.due_date ? dayjs(Number(task.due_date)).format('DD/MM/YYYY') : null;
    //     const start_date = task.start_date ? dayjs(Number(task.start_date)).format('DD/MM/YYYY') : null;

    //     return {...task, due_date, start_date }
    // })
})

const loading = computed(() => tasksStore.loading && props.listId === tasksStore.listId)

const getColHeader = (col) => {
    return col.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const editTask = (e) => {

    let { data, newValue, field } = e;

    if(field === 'due_date' || field === 'start_date'){
        e.preventDefault();
    }

    if(field === 'status') return

    if(newValue === data[field]) return

    data[field] = newValue

    tasksStore.loading = true;
    tasksStore.listId = data.list.id;

    axiosIns
        .put(`task/${data.id}`,{[field]: newValue})
        .then((res) => {
            const editedTask = res.data;
            const listId = editedTask.list.id;

            tasksStore.tasks[listId] = tasksStore.tasks[listId].map(task => {
                if(task.id !== editedTask.id) return task;

                return editedTask
            })

            tasksStore.loading = false;
            tasksStore.listId = null;
        })
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

const formatDate = (date) => {
    if(date){
        return dayjs(Number(date)).format('DD/MM/YYYY')
    }else{
        return 'Date Not Available'
    }
}
</script>

<template>
    <DataTable
        :value="tasks"
        :loading="loading"
        editMode="cell"
        :pt="{
            table: { style: 'min-width: 50rem' },
            column: {
                bodycell: ({ state }) => ({
                    class: [{ '!py-0': state['d_editing'] }]
                })
            }
        }"
        @cell-edit-complete="(e) => editTask(e)"
    >
        <Column v-for="col in tasksStore.columns" :field="col" :header="getColHeader(col)">
            <template #body="{data, field}">
                <div :class="[readOnlyFields.includes(field) ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700 rounded-lg p-2']" @click="(e) => {if(readOnlyFields.includes(field)) stopClick(e)}">
                    <div v-if="field === 'name'">
                    <div class="flex items-center gap-2">
                        {{ data[field] }}
                        <button
                            v-if="data['description']"
                            @click="(e) => openDescriptionDialog(e, data)"
                            class="rounded-sm border border-white p-0.5 text-sm cursor-pointer hover:text-gray-600 hover:border-gray-600 hover:bg-gray-300" 
                        >
                            <Bars3BottomLeftIcon class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                <div v-else-if="field === 'status'">
                    <span>{{ data[field].status }}</span>
                </div>
                <div v-else-if="field === 'creator'">
                    {{ data.creator.email }}
                </div>
                <div v-else-if="field.includes('date')">
                    <div v-if="!data[field] && !readOnlyFields.includes(field)">Add {{ field.split('_').join(' ') }} +</div>
                    <div v-else>{{ formatDate(data[field]) }}</div>
                </div>
                <div v-else>
                    <span>{{ data[field] }}</span>
                </div>
                </div>
            </template>
            <template #editor="{data, field, editorCancelCallback}">
                <div v-if="field === 'due_date' || field === 'start_date'">
                    <TaskListTimePickerEditor :date-value="data[field]" :task="data" :field="field" @close="editorCancelCallback" />
                </div>
                <div v-else-if="field === 'status'">
                    <TaskStatusSelect :task="data" :status-value="data[field].status" @close="editorCancelCallback" />
                </div>
                <div v-else>
                    <InputText v-model="data[field]" autofocus fluid />
                </div>
            </template>
        </Column>
        <template #empty>No tasks for this list.</template>
    </DataTable>


    <Dialog v-model:visible="visible" modal header="Description">
        <p>{{ currentTask.description }}</p>
    </Dialog>
</template>