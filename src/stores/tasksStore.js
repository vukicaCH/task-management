import axiosIns from "@/axios";

export const useTasksStore = defineStore('TasksStore',{
    state: ()=> ({
        tasks:{

        },
        loading: false,
        listId: null,
        columns:['name', 'linked_tasks'],
        allTasks:[]
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

        getAllTasks(){
            axiosIns.get(`/team/90151303803/task?include_closed=true`).then(res => {
                this.allTasks = res.data.tasks
            })
        }
    }
})