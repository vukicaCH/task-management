<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useViewsStore } from '@/stores/viewsStore';
import BoardTask from './BoardTask.vue';
import BoardSkeleton from '@/components/skeletons/BoardSkeleton.vue';

const spaceStore = useSpaceStore();
const tasksStore = useTasksStore();
const viewsStore = useViewsStore();

const toDoTasks = ref([]);
const completeTasks = ref([]);

const view = computed(() => {
    return viewsStore.views[spaceStore.currentType][spaceStore.currentTypeId]
})

const loaded = computed(() => spaceStore.currentTypeId in tasksStore.tasks[spaceStore.currentType])

watchEffect(() => {
    const id = spaceStore.currentTypeId
    const type = spaceStore.currentType

    let tasksProp = tasksStore.tasks[type];

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
        tasksStore.hydrateTasks(view.value)
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
            editedTask = tasksStore.tasks[spaceStore.currentType][spaceStore.currentTypeId].find(task => task.id === editedTask.parent)
        }

        tasksToUpdate.value.push(editedTask);

        if(updateTimeout) clearTimeout(updateTimeout)

        updateTimeout = setTimeout(() => {
            const listsToUpdate = {
                space: [],
                folder: [],
                list: []
            };

            tasksToUpdate.value.forEach(task => {

                const {list, folder, space} = task;

                if(list.id in tasksStore.tasks.list && !listsToUpdate.list.includes(list.id)) listsToUpdate.list.push(list.id);
                if(folder.id in tasksStore.tasks.folder && !listsToUpdate.folder.includes(folder.id)) listsToUpdate.folder.push(folder.id);
                if(space.id in tasksStore.tasks.space && !listsToUpdate.space.includes(space.id)) listsToUpdate.space.push(space.id);
            })

            let callbacks = []

            Object.entries(listsToUpdate).forEach(([boardType, boardTypeIds]) => {
                boardTypeIds.map(boardTypeId => {
                    const view = viewsStore.views[boardType][boardTypeId]

                    callbacks.push(() => tasksStore.hydrateTasks(view))
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
    completeTasks.value = [...completeTasks.value, taskToBeMoved]
}
</script>

<template>

    <div v-if="loaded" class="flex gap-4">
        <div>
            <span class="!font-medium">To Do Tasks: {{ toDoTasks.length }}</span>

            <div class="rounded-md !space-y-0.75 p-1 w-[275px] h-[600px] overflow-y-auto">
                <BoardTask v-for="task in toDoTasks" :task="task" :key="task.id" @task-completed="(id) => optimisticallyCompleteTask(id)" />
            </div>
        </div>

        <div>
            <span class="!font-medium">Complete Tasks: <span class="text-green-500 !font-bold">{{ completeTasks.length }}</span></span>

            <div class="rounded-md !space-y-0.75 p-1 w-[275px] h-[600px] overflow-y-auto">
                <BoardTask v-for="task in completeTasks" :task="task" :key="task.id" />
            </div>
        </div>
    </div>
    <BoardSkeleton v-else />
</template>