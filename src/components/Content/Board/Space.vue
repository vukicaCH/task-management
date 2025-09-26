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

const currentBoardView = computed(() => {
    const spaceId = spaceStore.currentSpace.id;

    return viewsStore.views.space['board'][spaceId]
})

watchEffect(() => {
    const view = currentBoardView.value

    if(view){

        const spaceId = view.parent.id;

        if(spaceId in tasksStore.spaceTasks){

            const toDo = [];
            const complete = []

            tasksStore.spaceTasks[spaceId].map(task => {
                if(task.status.status === 'to do')  toDo.push(task)
                else complete.push(task)
            })

            toDoTasks.value = toDo;
            completeTasks.value = complete;

            return
        }
        
        tasksStore.getSpaceTasks(view)
    }
})
</script>

<template>

    <div class="flex gap-4">
        <div>
            To Do Tasks: {{ toDoTasks.length }}

            <div class="border rounded-md !space-y-2 p-2 w-max h-[500px] overflow-y-scroll">
                <BoardTask v-for="task in toDoTasks" :task="task" :key="task.id" />
            </div>
        </div>

        <div>
            Complete Tasks: {{ completeTasks.length }}

            <div class="border rounded-md !space-y-2 p-2 w-max h-[500px">
                <BoardTask v-for="task in completeTasks" :task="task" :key="task.id" />
            </div>
        </div>
    </div>
</template>