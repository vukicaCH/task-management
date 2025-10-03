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
        hydrateListTasks(listId){
            this.listId = listId;
            this.loading = true;

            axiosIns
                .get(`list/${listId}/task?subtasks=true&include_closed=true`)
                .then(res => {
                    this.tasks.list[listId] = res.data.tasks
                })
                .then(() => {
                    this.loading = false
                    this.listId = null
                })
        },

        hydrateBoardTasks(view){
            this.loading = true;

            const {parent, id} = view

            axiosIns
                .get(`view/${id}/task`)
                .then(res => {
                    const type = parent.type === 4 ? 'space' : parent.type === 5 ? 'folder' : 'list';
                    const typeId = parent.id;

                    this.boardTasks[type][typeId] = res.data.tasks
                })
                .finally(() => this.loading = false)
        },

        async createTask(listId, taskData){

            const viewsStore = useViewsStore();

            await axiosIns
                .post(`list/${listId}/task`, taskData)
                .then(res => {

                    const {list, folder, space} = res.data;

                    this.tasks.list[listId] = [res.data, ...this.tasks.list[listId]]

                    this.tasks.team = [res.data, ...this.tasks.team]

                    if(list.id in this.boardTasks.list) this.hydrateBoardTasks(viewsStore.views.list[list.id])
                    if(folder.id in this.boardTasks.folder) this.hydrateBoardTasks(viewsStore.views.folder[folder.id])
                    if(space.id in this.boardTasks.space) this.hydrateBoardTasks(viewsStore.views.space[space.id])
                })
        },

        async getTask(taskId){
            return axiosIns
                .get(`task/${taskId}?include_subtasks=true`)
                .then(res => {
                    const {list, space, folder, id} = res.data;

                    if(list.id in this.tasks.list) this.tasks.list[list.id] = this.tasks.list[list.id].map(task => task.id === taskId ? res.data : task);
                    if(space.id in this.tasks.space) this.tasks.space[space.id] = this.tasks.space[space.id].map(task => task.id === taskId ? res.data : task);
                    if(folder.id in this.tasks.folder) this.tasks.space[folder.id] = this.tasks.space[folder.id].map(task => task.id === taskId ? res.data : task);

                    if(useFormsStore().task.id === id){useFormsStore().task = res.data}
                })
        },

        getAllTasks(){
            axiosIns.get(`/team/90151303803/task?include_closed=true&subtasks=true`).then(res => {
                this.tasks.team = res.data.tasks
            })
        },

        editTask(taskId, payload){

            const viewsStore = useViewsStore();

            this.loading = true;

            axiosIns
                .put(`/task/${taskId}`, payload)
                .then((res) => {
                    const {list, folder, space, id} = res.data;

                    const linked_tasks = this.tasks.list[list.id].find(task => task.id === id).linked_tasks

                    const editedTask = {...res.data, linked_tasks}

                    this.tasks.list[list.id] = this.tasks.list[list.id].map(task => task.id === id ? editedTask : task)

                    this.tasks.team = this.tasks.team.map(task => task.id === editedTask.id ? editedTask : task)

                    if(list.id in this.boardTasks.list) this.hydrateBoardTasks(viewsStore.views.list[list.id])
                    if(folder.id in this.boardTasks.folder) this.hydrateBoardTasks(viewsStore.views.folder[folder.id])
                    if(space.id in this.boardTasks.space) this.hydrateBoardTasks(viewsStore.views.space[space.id])
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
                .then(() => this.getTask(taskId))
        },

        removeTag(taskId, tag){
            axiosIns.delete(`task/${taskId}/tag/${tag.name}`)
                .then(() => this.getTask(taskId))
        }
    }
})