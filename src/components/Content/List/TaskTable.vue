<script setup>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { useTasksStore } from '@/stores/tasksStore';
import { useFormsStore } from '@/stores/formsStore';
import TaskTableNameEditor from './TaskTablePartials/TaskTableNameEditor.vue';
import TaskTableAddTaskForm from './TaskTablePartials/TaskTableAddTaskForm.vue';
import { Button } from 'primevue';
import TaskTableNode from './TaskTablePartials/TaskTableNode.vue';
import { useViewsStore } from '@/stores/viewsStore';

const props = defineProps({
    listId:{
        type: String,
        required: true
    },
})

const tasksStore = useTasksStore();
const formsStore = useFormsStore();

const isNewTasksFormOpen = ref(false)

const toggleNewTaskForm = () => isNewTasksFormOpen.value = !isNewTasksFormOpen.value

const tasks = computed(() => {
    if(props.listId in tasksStore.boardTasks.list){
        const treeTasks = buildTaskTree(tasksStore.boardTasks.list[props.listId])

        if(isNewTasksFormOpen.value){
            return [{list_id: props.listId}, ...treeTasks] //this will allow us to add new task form inside table header
        }

        return treeTasks;
    }

    return []
})

function buildTaskTree(tasks) {
    return tasks.map(task => {
        let children = [];

        if(task.subtasks){
            children = task.subtasks?.map(subtask => ({
                key: task.id,
                label: task.name,
                parent: subtask.parent,
                data: {...subtask},
            }))
        }

        return {
            key: task.id,
            label: task.name,
            data: {...task},
            children : [...children,  {top_level_parent: task.id, list_id: task.list.id}]
        }
    });
}

const loaded = computed(() => props.listId in tasksStore.boardTasks.list)

const getColHeader = (col) => {
    return col.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const openForm = (formName, task) => {
    formsStore.toggleForm(formName);
    formsStore.task = {...task}
}

provide('openForm', openForm);
</script>

<template>
    <TreeTable
        :value="tasks"
        :loading="!loaded"
    >
        <template #header>
            <Button
                severity="secondary"
                outlined
                @click="toggleNewTaskForm"
            >
                + Add Task
            </Button>
        </template>
        <Column
            field="name"
            header="Name"
            expander
        >
            <template #body="{node}">
                <TaskTableNameEditor v-if="node.data" :task="node.data" />
                <TaskTableAddTaskForm
                    v-else
                    :top_level_parent="node?.top_level_parent"
                    :list_id="node.list_id"
                    @close="toggleNewTaskForm"
                />
            </template>
        </Column>
        <Column v-for="col in tasksStore.columns" :field="col" :header="getColHeader(col)">
            <template #body="{node}">
                <div v-if="node.data">
                    <TaskTableNode :column="col" :task="node.data" />
                </div>
            </template>
        </Column>
    </TreeTable>
</template>