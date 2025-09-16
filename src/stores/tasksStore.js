import axiosIns from "@/axios";
import { useSpaceStore } from "./spaceStore";

export const useTasksStore = defineStore('TasksStore',{
    state: ()=> ({
        tasks:{

        },
        loading: false,
        listId: null,
        columns:['name', 'linked_tasks'],
        listViewTasks:[]
    }),

    actions:{
        hydrateTasks(listId){
            this.listId = listId;
            this.loading = true;

            axiosIns
                .get(`list/${listId}/task`)
                .then(res => this.tasks[listId] = res.data.tasks)
                .then(() => {
                    this.loading = false
                    this.listId = null
                })
        },

        hydrateListViewTasks(){
            const spaceStore = useSpaceStore()
            const listViewId = spaceStore.views.list.id;

            axiosIns.get(`/view/${listViewId}/task`).then(res => this.listViewTasks = res.data.tasks)
        }
    }
})