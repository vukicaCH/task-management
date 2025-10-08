import axiosIns from "@/axios";
import _ from "lodash";
import { useFormsStore } from "./formsStore";
import { useViewsStore } from "./viewsStore";

export const useTasksStore = defineStore('TasksStore',{
    state: ()=> ({
        tasks:{
            list: {},
            team: []
        },
        loading: false,
        listId: null,
        columns:['due_date', 'date_done'],
        readOnlyFields: ['date_done','date_updated','date_closed','date_created','creator'],
        allTasks:[],
        boardTasks:{
            space: {},
            folder: {},
            list: {},
        }
    }),

    actions:{
        hydrateBoardTasks(view){
            this.loading = true;
            const {parent, id} = view

            const parentType = parent.type === 4 ? 'space' : parent.type === 5 ? 'folder' : 'list';
            const parentTypeId = parent.id;

            if(parentType === 'list') this.listId = parent.id

            axiosIns
                .get(`view/${id}/task`)
                .then(res => {

                    console.log(`done for ${parentType} ${parentTypeId}`)

                    this.boardTasks[parentType][parentTypeId] = res.data.tasks
                })
                .finally(() => this.loading = false)
        },

        createTask(listId, taskData, taskParentId = null){
            axiosIns
                .post(`list/${listId}/task`, {...taskData, parent: taskParentId})
                .then(res => {
                    const viewsStore = useViewsStore()

                    const {list, folder, space} = res.data;

                    if(list.id in this.boardTasks.list){
                        const view = viewsStore.views.list[list.id];

                        this.hydrateBoardTasks(view)
                    }

                    if(folder.id in this.boardTasks.folder){
                        const view = viewsStore.views.folder[folder.id];

                        this.hydrateBoardTasks(view)
                    }

                    if(space.id in this.boardTasks.space){
                        const view = viewsStore.views.space[space.id];

                        this.hydrateBoardTasks(view)
                    }


                })
        },

        getAllTasks(){
            axiosIns.get(`/team/90151303803/task?include_closed=true&subtasks=true`).then(res => {
                this.tasks.team = res.data.tasks
            })
        },

        editTask(task, payload){

            this.loading = true;

            axiosIns
                .put(`/task/${task.id}`, payload)
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
                const toTask = this.tasks.team.find(task => task.id === to) 

                const {list, id} = fromTask;

                this.tasks.list[list.id] = this
                                        .tasks[list.id]
                                        .map(task => task.id === id ? fromTask : task)                   

                if(toTask.list.id in this.tasks.list && this.tasks.list[toTask.list.id].length){
                    axiosIns
                        .get(`task/${to}`)
                        .then(res => {

                            const newTask = res.data

                            this.tasks.list[toTask.list.id] = this
                                                            .tasks[toTask.list.id]
                                                            .map(task => task.id === to ? newTask : task)
                        })
                }
            })
        },

        attachTag(taskId, tag){
            axiosIns.post(`task/${taskId}/tag/${tag.name}`)
        },

        removeTag(taskId, tag){
            axiosIns.delete(`task/${taskId}/tag/${tag.name}`)
        }
    }
})