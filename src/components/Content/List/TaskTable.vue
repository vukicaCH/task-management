<script setup>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { InputText } from 'primevue';
import { useTasksStore } from '@/stores/tasksStore';
import { useFormsStore } from '@/stores/formsStore';
import dayjs from 'dayjs';
import TaskListLinkedTasks from './TaskListLinkedTasks.vue';
import TaskListTagsEditor from './TaskListTagsEditor.vue';
import TaskListPriority from './TaskListPriority.vue';
import TaskStatusSelect from './TaskStatusSelect.vue';
import TaskListTimePickerEditor from './TaskListTimePickerEditor.vue';
import TaskTableArchiveEditor from './TaskTableArchiveEditor.vue';
import TaskTableNameEditor from './TaskTableNameEditor.vue';
import TaskTableAddSubtasksForm from './TaskTableAddTaskForm.vue';
import { Button } from 'primevue';

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
    if(props.listId in tasksStore.tasks){
        const treeTasks = buildTaskTree(tasksStore.tasks[props.listId])

        if(isNewTasksFormOpen.value){
            return [{list_id: props.listId}, ...treeTasks]
        }

        return treeTasks;
    }

    return []
})

function buildTaskTree(tasks) {
    // Make a lookup map: id → task
    const taskMap = {};
    tasks.forEach(task => {
        taskMap[task.id] = {
            key: task.id,
            label: task.name,
            data: {...task},
            children: []
        };
    });

    const roots = [];

    tasks.forEach(task => {
        if (task.top_level_parent) {
            // This is a subtask → push into its parent
            if (taskMap[task.top_level_parent]) {
                taskMap[task.top_level_parent].children.push(taskMap[task.id]);
            }
        } else {
            // No parent → it's a root task
            roots.push(taskMap[task.id]);
        }
    });

    const rootsWithAddSubtasksFormIndicator = roots.map(root => {
        if(!root.top_level_parent) return {...root, children: [...root.children, {top_level_parent: root.key, list_id: root.data.list.id}]}
        else root
    })

    return rootsWithAddSubtasksFormIndicator
}

const loading = computed(() => tasksStore.loading && props.listId === tasksStore.listId)

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
        :loading="loading"
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
                <TaskTableAddSubtasksForm
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
                    <TaskListLinkedTasks v-if="col === 'linked_tasks'" :task="node.data" />
                    <TaskListTagsEditor v-if="col === 'tags'" :task="node.data" />
                    <TaskListPriority v-if="col === 'priority'" :task="node.data" />
                    <TaskStatusSelect v-if="col === 'status'" :task="node.data"/>
                    <TaskListTimePickerEditor v-if="col.includes('date')" :task="node.data" :field="col" />
                    <TaskTableArchiveEditor v-if="col === 'archived'" :task="node.data" />
                    <div v-if="col === 'creator'" class="cursor-not-allowed" v-tooltip.top="'Read Only'">
                        {{ node.data[col].username }}
                    </div>
                </div>
            </template>
        </Column>
    </TreeTable>
</template>