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

const loaded = computed(() => !tasksStore.loading && (spaceStore.currentTypeId in tasksStore.boardTasks[spaceStore.currentType]))

watchEffect(() => {

    // const hhh = spaceStore.currentTypeId

    // spaceStore.getSpaceView()

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
    }else if(viewsStore.currentView){
        tasksStore.hydrateBoardTasks(viewsStore.currentView)
    }
})
</script>

<template>

    <div v-if="loaded" class="flex gap-4">
        <div>
            To Do Tasks: {{ toDoTasks.length }}

            <div class="rounded-md !space-y-0.75 p-1 w-[275px] h-[500px] overflow-y-auto bg-gray-700">
                <BoardTask v-for="task in toDoTasks" :task="task" :key="task.id" />
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