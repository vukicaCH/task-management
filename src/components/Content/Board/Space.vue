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

const loaded = computed(() => !tasksStore.loading || spaceStore.currentSpace.id in tasksStore.spaceTasks)

watchEffect(() => {

    //spaceStore.getSpaceView(spaceStore.currentSpace.id)

    if(viewsStore.currentView){

        const parent = viewsStore.currentView.parent;

        let tasksProp = {}
        let tasksGetter = '';

        switch(parent.type){
            case 6:
                tasksProp = tasksStore.listTasks
                tasksGetter = () => tasksStore.getListTasks(viewsStore.currentView)
            case 5:
                tasksProp = tasksStore.folderTasks;
                tasksGetter = () => tasksStore.getFolderTasks(viewsStore.currentView)
            case 4:
                tasksProp = tasksStore.spaceTasks
                tasksGetter = () => tasksStore.getSpaceTasks(viewsStore.currentView)    
        }

        if(parent.id in tasksProp){

            const toDo = [];
            const complete = []

            tasksProp[parent.id].map(task => {
                if(task.status.status === 'to do')  toDo.push(task)
                else complete.push(task)
            })

            toDoTasks.value = toDo;
            completeTasks.value = complete;
        }else{
           tasksGetter()
        }
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
</template>