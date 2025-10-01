<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import ColumnChooser from './ColumnChooser.vue';
import { Panel } from 'primevue';
import { ChevronLeftIcon, ChevronDownIcon, FolderIcon } from '@heroicons/vue/24/outline';
import TaskTable from './TaskTable.vue';

const spaceStore = useSpaceStore();

const tasksStore = useTasksStore()

const getTasksForList = (listId) => {
    if(!(listId in tasksStore.tasks)) tasksStore.hydrateTasks(listId)
}

const onCollapse = (collapsed, listId) => {
    if(!collapsed){
        getTasksForList(listId)
    }
}

onMounted(()=> {
    tasksStore.getAllTasks();
})
</script>

<template>
    <div class="!space-y-2">
        <ColumnChooser />

        <Panel v-for="list in spaceStore.getLists" :key="list.id" :header="list.name" toggleable :collapsed="true" @update:collapsed="(collapsed) => onCollapse(collapsed, list.id)">
            <template #header>
                <div class="flex flex-col">
                    <span class="text-xs text-gray-400 flex gap-1 !font-medium" v-if="!list.folder.hidden"><FolderIcon class="w-4"/> {{ list.folder.name }}</span>
                    <span class="!font-medium">{{ list.name }}</span>
                </div>
            </template>
            <template #toggleicon="{collapsed}">
                <ChevronLeftIcon v-if="collapsed" class="w-5 h-5" />
                <ChevronDownIcon v-else class="w-5 h-5" />
            </template>
            <TaskTable :list-id="list.id" />
        </Panel>
    </div>
</template>