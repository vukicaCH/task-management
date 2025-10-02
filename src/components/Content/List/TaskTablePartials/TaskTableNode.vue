<script setup>
import TaskTableLinkedTasks from './TaskTableLinkedTasks.vue';
import TaskTableArchiveEditor from './TaskTableArchiveEditor.vue';
import TaskTableTagsEditor from './TaskTableTagsEditor.vue';
import TaskTablePriority from './TaskTablePriority.vue';
import TaskTableStatusSelect from './TaskTableStatusSelect.vue';
import TaskTableTimePickerEditor from './TaskTableTimePickerEditor.vue';

const props = defineProps({
    column:{
        type: String,
        required: true
    },

    task:{
        type: Object,
        required: true,
    }
})

const nodes = {
    'linked_tasks': TaskTableLinkedTasks,
    'archived': TaskTableArchiveEditor,
    'tags': TaskTableTagsEditor,
    'priority': TaskTablePriority,
    'status': TaskTableStatusSelect
}

const dynamicProps = computed(() => {
    if(props.column.includes('date')) return {task: props.task, field: props.column}
    else return {task: props.task}
})

</script>

<template>
    <component :is="nodes[column] ?? TaskTableTimePickerEditor" v-bind="dynamicProps" />
</template>