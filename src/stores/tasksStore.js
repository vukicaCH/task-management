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
                    this.boardTasks[parentType][parentTypeId] = res.data.tasks
                })
                .finally(() => this.loading = false)
        },

        async createTask(listId, taskData, taskParentId = null){
            return await axiosIns
                .post(`list/${listId}/task`, {...taskData, parent: taskParentId})
                .then(res => {

                    this.handleTasksUpdates(res.data)

                    return res.data
                })
        },

        getAllTasks(){
            axiosIns.get(`/team/90151303803/task?include_closed=true&subtasks=true`).then(res => {
                this.tasks.team = res.data.tasks
            })
        },

        editTask(taskId, payload){

            this.loading = true;

            axiosIns
                .put(`/task/${taskId}`, payload)
                .then((res) => {

                    let mainTask = null;

                    const {list, folder, space, id, parent} = res.data;

                    if(parent){
                        if(list.id in this.boardTasks.list) mainTask = this.boardTasks.list[list.id].find(task => task.id === parent);
                        else if(folder.id in this.boardTasks.folder) mainTask = this.boardTasks.folder[folder.id].find(task => task.id === parent)
                        else mainTask = this.boardTasks.space[space.id].find(task => task.id === parent)
                    }else{
                        mainTask = res.data;
                    }

                    if(mainTask?.subtasks){
                        const mainTaskSubtasks = mainTask.subtasks.filter(subtask => subtask.status === 'to do');

                        mainTask = {...mainTask, subtasks: mainTaskSubtasks, subtasks_count: mainTaskSubtasks.length}
                    }

                    if(list.id in this.boardTasks.list) this.boardTasks.list[list.id] = this.boardTasks.list[list.id].map(task => task.id === mainTask.id ? mainTask : task);
                    if(folder.id in this.boardTasks.list) this.boardTasks.folder[folder.id] = this.boardTasks.folder[folder.id].map(task => task.id === mainTask.id ? mainTask : task);
                    if(space.id in this.boardTasks.space) this.boardTasks.space[space.id] = this.boardTasks.space[space.id].map(task => task.id === mainTask.id ? mainTask : task);
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