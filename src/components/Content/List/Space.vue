<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import ColumnChooser from './ColumnChooser.vue';
import TaskList from './TaskList.vue';
import { Panel } from 'primevue';
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';

const spaceStore = useSpaceStore();

const allListsInSpace = computed(() => {
    const spaceId = spaceStore.currentSpace?.id

    const allSpaceLists = [...spaceStore.lists.space[spaceId]]

    const allFolderLists = []
    
    spaceStore.folders[spaceId].forEach(folder => spaceStore.lists.folder[folder.id].map(list => allFolderLists.push(list)))

    return [...allSpaceLists, ...allFolderLists];
})

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
    tasksStore.hydrateListViewTasks();
})
</script>

<template>
    <div class="!space-y-2">
        <ColumnChooser />

        <Panel v-for="list in allListsInSpace" :key="list.id" :header="list.name" toggleable :collapsed="true" @update:collapsed="(collapsed) => onCollapse(collapsed, list.id)">
            <template #header>
                <div class="flex flex-col">
                    <span class="text-xs text-gray-400"><span v-if="!list.folder.hidden">{{ list.folder.name }} / </span>{{ list.name }}</span>
                    <span class="!font-medium">{{ list.name }} ({{ list.task_count }})</span>
                </div>
            </template>
            <template #toggleicon="{collapsed}">
                <ChevronLeftIcon v-if="collapsed" class="w-5 h-5" />
                <ChevronDownIcon v-else class="w-5 h-5" />
            </template>
            <TaskList :list-id="list.id" />
        </Panel>
    </div>
</template>