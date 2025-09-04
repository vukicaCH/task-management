import axiosIns from "@/axios";

export const useTasksStore = defineStore('TasksStore',{
    state: ()=> ({
        tasks:{

        },
        loading: false,
        listId: null,
        columns:['name','due_date','status','date_created','start_date', 'creator']
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
        }
    }
})