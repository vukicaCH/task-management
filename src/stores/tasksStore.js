import axiosIns from "@/axios";
import _ from "lodash";
import { useFormsStore } from "./formsStore";
import { useViewsStore } from "./viewsStore";

export const useTasksStore = defineStore('TasksStore',{
    state: ()=> ({
        tasks:{},
        loading: false,
        listId: null,
        columns:['due_date', 'date_done'],
        readOnlyFields: ['date_done','date_updated','date_closed','date_created','creator'],
        allTasks:[],
        spaceTasks:{},
    }),

    actions:{
        hydrateTasks(listId){
            this.listId = listId;
            this.loading = true;

            axiosIns
                .get(`list/${listId}/task?subtasks=true&include_closed=true`)
                .then(res => this.tasks[listId] = res.data.tasks)
                .then(() => {
                    this.loading = false
                    this.listId = null
                })
        },

        async getTask(taskId){
            return axiosIns
                .get(`task/${taskId}?include_subtasks=true`)
                .then(res => {
                    const {list, space, id} = res.data;

                    if(list.id in this.tasks) this.tasks[list.id] = this.tasks[list.id].map(task => task.id === taskId ? res.data : task);
                    if(space.id in this.spaceTasks) this.spaceTasks[space.id] = this.spaceTasks[space.id].map(task => task.id === taskId ? res.data : task);

                    if(useFormsStore().task.id === id){useFormsStore().task = res.data}
                })
        },

        getAllTasks(){
            axiosIns.get(`/team/90151303803/task?include_closed=true&subtasks=true`).then(res => {
                this.allTasks = res.data.tasks
            })
        },

        getSpaceTasks(view){
            axiosIns
                .get(`view/${view.id}/task`)
                .then(res => {
                    const spaceId = view.parent.id

                    this.spaceTasks[spaceId] = res.data.tasks
                })
        },

        editTask(taskId, payload){

            const viewsStore = useViewsStore();

            this.loading = true;
            if(viewsStore.currentViewTab === 'list') this.listId = this.allTasks.find(task => task.id === taskId).list.id;

            axiosIns
                .put(`/task/${taskId}`, payload)
                .then((res) => {

                    const editedTask = res.data
                    
                    this.getTask(editedTask.id) // task edit, doesn't return linked_tasks, so we need to use this instead...

                    //all Tasks can be huge up to 200+ tasks or even more, always replace the edited part(faster)
                    this.allTasks = this.allTasks.map(task => task.id === editedTask.id ? editedTask : task)
                })
                .finally(()=> {
                    this.loading = false;
                    this.listId = null;
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
        },

        attachTag(taskId, tag){
            axiosIns.post(`task/${taskId}/tag/${tag.name}`)
                .then(() => this.getTask(taskId))
        },

        removeTag(taskId, tag){
            axiosIns.delete(`task/${taskId}/tag/${tag.name}`)
                .then(() => this.getTask(taskId))
        }
    }
})