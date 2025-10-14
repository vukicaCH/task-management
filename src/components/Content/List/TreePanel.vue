<script setup>
import { Panel } from 'primevue';
import { ChevronLeftIcon, ChevronDownIcon, FolderIcon } from '@heroicons/vue/24/outline';
import TaskTable from './TaskTable.vue';
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useViewsStore } from '@/stores/viewsStore';

const {list} = defineProps({
    list:{
        type: Object,
        required: true
    }
})

const spaceStore = useSpaceStore();
const tasksStore = useTasksStore();
const viewsStore = useViewsStore();

const view = computed(() => viewsStore.views.list[list.id])

const isList = computed(() => spaceStore.currentType === 'list');

const onCollapse = async (collapsed, listId) => {

    if(!view.value) await viewsStore.setView('list', listId);

    if(!collapsed && !(listId in tasksStore.tasks.list)) tasksStore.hydrateTasks(view.value)
}

watchEffect(() => {
    if(isList.value && !(list.id in tasksStore.tasks.list) && view.value) tasksStore.hydrateTasks(view.value)
})
</script>

<template>
    <Panel
        :key="list.id"
        :header="list.name"
        toggleable
        :collapsed="!isList"
        @update:collapsed="(collapsed) => onCollapse(collapsed, list.id)"
    >
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
</template>