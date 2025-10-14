import axios from "@/axios";
import _ from "lodash";
import { useViewsStore } from "./viewsStore";

export const useTasksStore = defineStore('TasksStore',{
    state: ()=> ({
        loading: false,
        listId: null,
        columns: ['status', 'due_date', 'date_created', 'priority'],
        readOnlyFields: ['date_done','date_updated','date_closed','date_created','creator'],
        allTasks:[],
        tasks:{
            space: {},
            folder: {},
            list: {},
            team: []
        },
        listEditMode: false
    }),

    actions:{
        hydrateTasks(view){
            this.loading = true;
            const {parent, id} = view

            const parentType = parent.type === 4 ? 'space' : parent.type === 5 ? 'folder' : 'list';
            const parentTypeId = parent.id;

            if(parentType === 'list') this.listId = parent.id

            axios
                .get(`view/${id}/task`)
                .then(res => {

                    console.log(`done for ${parentType} ${parentTypeId}`)

                    this.tasks[parentType][parentTypeId] = res.data.tasks
                })
                .finally(() => this.loading = false)
        },

        createTask(listId, taskData, taskParentId = null){
            axios
                .post(`list/${listId}/task`, {...taskData, parent: taskParentId})
                .then(res => {
                    const viewsStore = useViewsStore()

                    const {list, folder, space} = res.data;

                    if(list.id in this.tasks.list){
                        const view = viewsStore.views.list[list.id];

                        this.hydrateTasks(view)
                    }

                    if(folder.id in this.tasks.folder){
                        const view = viewsStore.views.folder[folder.id];

                        this.hydrateTasks(view)
                    }

                    if(space.id in this.tasks.space){
                        const view = viewsStore.views.space[space.id];

                        this.hydrateTasks(view)
                    }


                })
        },

        getAllTasks(){
            axios.get(`/team/90151303803/task?include_closed=true&subtasks=true`).then(res => {
                this.tasks.team = res.data.tasks
            })
        },

        editTask(task, payload){

            this.loading = true;

            console.log(task)

            axios
                .put(`/task/${task.id}`, payload)
                .finally(()=> {
                    this.loading = false;
                    this.listId = null;
                })
        },

        // toggleTaskLink(to,from, linked){
        //     const method = linked ? 'delete' : 'post'

        //     axios({url: `task/${from}/link/${to}`, method})
        //     .then(res => {

        //         const fromTask = res.data.task;
        //         const toTask = this.tasks.team.find(task => task.id === to) 

        //         const {list, id} = fromTask;

        //         this.tasks.list[list.id] = this
        //                                 .tasks[list.id]
        //                                 .map(task => task.id === id ? fromTask : task)                   

        //         if(toTask.list.id in this.tasks.list && this.tasks.list[toTask.list.id].length){
        //             axios
        //                 .get(`task/${to}`)
        //                 .then(res => {

        //                     const newTask = res.data

        //                     this.tasks.list[toTask.list.id] = this
        //                                                     .tasks[toTask.list.id]
        //                                                     .map(task => task.id === to ? newTask : task)
        //                 })
        //         }
        //     })
        // },

        attachTag(taskId, tag){
            axios.post(`task/${taskId}/tag/${tag.name}`)
        },

        removeTag(taskId, tag){
            axios.delete(`task/${taskId}/tag/${tag.name}`)
        }
    }
})