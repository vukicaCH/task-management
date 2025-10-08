<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import ColumnChooser from './ColumnChooser.vue';
import TreePanel from './TreePanel.vue';
import { useTasksStore } from '@/stores/tasksStore';
import { useViewsStore } from '@/stores/viewsStore';

const spaceStore = useSpaceStore()
const tasksStore = useTasksStore()
const viewsStore = useViewsStore();

const tasksToUpdate = ref([])
let updateTimeout = null;

tasksStore.$onAction(
  ({
    name,
    args,
  }) => {

    if(name === 'editTask' ){

        console.log(args[0])

        let editedTask = args[0];

        if(editedTask.parent){
            editedTask = tasksStore.boardTasks[spaceStore.currentType][spaceStore.currentTypeId].find(task => task.id === editedTask.parent)
        }

        tasksToUpdate.value.push(editedTask);

        if(updateTimeout) clearTimeout(updateTimeout)

        updateTimeout = setTimeout(() => {
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
        }, 1500)
    }
  }
)
</script>

<template>
    <div class="!space-y-2">
        <ColumnChooser />
        <TreePanel v-for="list in spaceStore.getLists" :list />
    </div>
</template>