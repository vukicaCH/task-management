<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useViewsStore } from '@/stores/viewsStore';
import ListCreateButton from './ListCreateButton.vue';
import ColumnChooser from './ColumnChooser.vue';
import TreePanel from './TreePanel.vue';

const spaceStore = useSpaceStore()
const tasksStore = useTasksStore()
const viewsStore = useViewsStore();

const tasksToUpdate = ref([])
let updateTimeout = null;

watch(() => tasksStore.listEditMode, (newVal) => {

    if(newVal){
        if(updateTimeout) clearTimeout(updateTimeout)
        return
    }


    if(!newVal && tasksToUpdate.value.length){

        if(updateTimeout) clearTimeout(updateTimeout)

        updateTimeout = setTimeout(()=> {
            const boardTasksToUpdate = {
                space: [],
                folder: [],
                list: []
            };

            tasksToUpdate.value.forEach(task => {

                const {list, folder, space} = task;

                if(list.id in tasksStore.boardTasks.list && !boardTasksToUpdate.list.includes(list.id)) boardTasksToUpdate.list.push(list.id);
                if(folder.id in tasksStore.boardTasks.folder && !boardTasksToUpdate.folder.includes(folder.id)) boardTasksToUpdate.folder.push(folder.id);
                if(space.id in tasksStore.boardTasks.space && !boardTasksToUpdate.space.includes(space.id)) boardTasksToUpdate.space.push(space.id);
            })

            let callbacks = []

            Object.entries(boardTasksToUpdate).forEach(([boardType, boardTypeIds]) => {
                boardTypeIds.map(boardTypeId => {
                    const view = viewsStore.views[boardType][boardTypeId]

                    callbacks.push(() => tasksStore.hydrateBoardTasks(view))
                })
            })

            Promise.all(callbacks.map(callback => callback()))

            tasksToUpdate.value = []
        }, 2000)
    }
})

tasksStore.$onAction(
  ({
    name,
    args,
  }) => {

    if(name === 'editTask' ){
       tasksToUpdate.value.push(args[0]);
    }
  }
)


</script>

<template>
    <div v-if="spaceStore.getLists.length" class="!space-y-2 max-w-[800]px overflow-y-hidden">
        <ColumnChooser />
        <TreePanel v-for="list in spaceStore.getLists" :list />
    </div>

    <ListCreateButton v-else />
</template>