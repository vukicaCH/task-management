import axiosIns from "@/axios";
import dayjs from 'dayjs';

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
        },

        editTask(data){

            const dataToBeSent = {};

            for(const [key, value] of Object.entries(data)){
                if(key.includes('date')){
                    dataToBeSent[key] = dayjs(value).valueOf()
                }
                else{
                    dataToBeSent[key] = value
                }
            }

            console.log(data.priority)

            dataToBeSent['status'] = data.status.status
            dataToBeSent['priority'] = data.priority?.id

            console.log(dataToBeSent)

            axiosIns
                .put(`/task/${dataToBeSent.id}`, dataToBeSent)
                .then((res) => {

                    const editedTask = res.data
                    const {list, id} = editedTask

                    //task edit always returns linked_tasks as an empty array...
                    //that's why it's maybe better to refresh the whole list...

                    this.hydrateTasks(list.id)

                    //all Tasks can be huge up to 200+ tasks or even more, always replace the edited part(faster)
                    this.allTasks = this.allTasks.map(task => task.id === id ? editedTask : task)
                })
        },

        toggleTaskLink(to,from, linked){
            const method = linked ? 'delete' : 'post'

            axiosIns({url: `task/${from}/link/${to}`, method})
            .then(res => {

                const fromTask = res.data.task;
                const toTask = this.allTasks.find(task => task.id === to) 

                const {list, id} = fromTask;

                this.tasks[list.id] = this
                                        .tasks[list.id]
                                        .map(task => task.id === id ? fromTask : task)                   

                if(toTask.list.id in this.tasks && this.tasks[toTask.list.id].length){
                    axiosIns
                        .get(`task/${to}`)
                        .then(res => {

                            const newTask = res.data

                            this.tasks[toTask.list.id] = this
                                                            .tasks[toTask.list.id]
                                                            .map(task => task.id === to ? newTask : task)
                        })
                }
            })
        }
    }
})