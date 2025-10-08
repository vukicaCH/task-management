<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useViewsStore } from '@/stores/viewsStore';
import BoardTask from './BoardTask.vue';

const spaceStore = useSpaceStore();
const tasksStore = useTasksStore();
const viewsStore = useViewsStore();

const toDoTasks = ref([]);
const completeTasks = ref([]);

const view = computed(() => {
    return viewsStore.views[spaceStore.currentType][spaceStore.currentTypeId]
})

const loaded = computed(() => spaceStore.currentTypeId in tasksStore.boardTasks[spaceStore.currentType])

watchEffect(() => {
    const id = spaceStore.currentTypeId
    const type = spaceStore.currentType

    let tasksProp = tasksStore.boardTasks[type];

    if(id in tasksProp){

        const toDo = [];
        const complete = []

        tasksProp[id].map(task => {
            if(task.status.status === 'to do') toDo.push(task)
            else complete.push(task)
        })

        toDoTasks.value = toDo;
        completeTasks.value = complete;
    }else if(view.value){
        tasksStore.hydrateBoardTasks(view.value)
    }
})

const tasksToUpdate = ref([])
let updateTimeout = null;

tasksStore.$onAction(
  ({
    name,
    args,
  }) => {

    if(name === 'editTask'){

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
        }, 1000)
    }
  }
)

const optimisticallyCompleteTask = (id) => {

    const taskToBeMoved = toDoTasks.value.find(task => task.id === id);

    toDoTasks.value = toDoTasks.value.filter(task => task.id !== taskToBeMoved.id);
    completeTasks.value = [taskToBeMoved, ...completeTasks.value]
}
</script>

<template>

    <div v-if="loaded" class="flex gap-4">
        <div>
            To Do Tasks: {{ toDoTasks.length }}

            <div class="rounded-md !space-y-0.75 p-1 w-[275px] h-[500px] overflow-y-auto bg-gray-700">
                <BoardTask v-for="task in toDoTasks" :task="task" :key="task.id" @task-completed="(id) => optimisticallyCompleteTask(id)" />
            </div>
        </div>

        <div>
            Complete Tasks: {{ completeTasks.length }}

            <div class="bg-gray-700 rounded-md !space-y-0.75 p-1 w-[275px] h-[500px] overflow-y-auto">
                <BoardTask v-for="task in completeTasks" :task="task" :key="task.id" />
            </div>
        </div>
    </div>
    <div v-else>Loading...</div>
</template>