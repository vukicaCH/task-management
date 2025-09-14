<script setup>
import { Dialog } from 'primevue';
import ToggleSwitch from 'primevue/toggleswitch';
import { ViewColumnsIcon } from '@heroicons/vue/24/outline';
import { useTasksStore } from '@/stores/tasksStore';
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore();
const tasksStore = useTasksStore()

const columns = computed(() => {

    const cols = [
        'archived',
        'creator',
        'date_closed',
        'date_created',
        'date_done',
        'date_updated',
        'linked_tasks',
        'name',
        'priority',
        'start_date',
        'status'
    ];

    const space = spaceStore.currentSpace;

    if(space.features.tags.enabled) cols.push('tags');
    if(space.features.due_dates.enabled) cols.push('due_date');

    return cols
})

const getColName = (col) => {
    return col.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const toggleColumn = (e, col) => {

    if(e){
        tasksStore.columns = [...tasksStore.columns, col]
    }else{
        tasksStore.columns = [...tasksStore.columns.filter(colName => colName !== col)]
    }
}

const visible = ref(false)
</script>

<template>
    <button @click="visible = true" class="flex gap-1 text-sm rounded-lg border border-gray-500 hover:text-gray-500 p-1 cursor-pointer">
        Columns <ViewColumnsIcon class="w-5 h-5" />
    </button>

    <Dialog v-model:visible="visible" modal header="Columns">
        <div class="!space-y-3">
            <div v-for="col in columns" class="flex justify-between w-[300px]">
                <span>{{ getColName(col) }}</span>
                <ToggleSwitch :default-value="tasksStore.columns.includes(col)" @value-change="(e) => toggleColumn(e, col)"/>
            </div>
        </div>
    </Dialog>
</template>