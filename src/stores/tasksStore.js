import axiosIns from "@/axios";
import _ from "lodash";
import { useFormsStore } from "./formsStore";
import { useViewsStore } from "./viewsStore";

export const useTasksStore = defineStore('TasksStore',{
    state: ()=> ({
        tasks:{
            space: {},
            folder: {},
            list: {},
            team: []
        },
        loading: false,
        listId: null,
        columns:['due_date', 'date_done'],
        readOnlyFields: ['date_done','date_updated','date_closed','date_created','creator'],
        allTasks:[],
    }),

    actions:{

        buildTree(tasks) {
            const taskMap = new Map();

            // napravi mapu taskova
            tasks.forEach(task => {
                task.subtasks = [];
                taskMap.set(task.id, task);
            });

            const tree = [];

            tasks.forEach(task => {
                if (task.parent) {
                    const parent = taskMap.get(task.parent);
                    if (parent) {
                        parent.subtasks.push(task);
                    }
                } else {
                    tree.push(task);
                }
            });

            return tree;
        },
        
        hydrateListTasks(listId){
            this.listId = listId;
            this.loading = true;

            axiosIns
                .get(`list/${listId}/task?subtasks=true&include_closed=true`)
                .then(res => {
                    this.tasks.list[listId] = this.buildTree(res.data.tasks)
                })
                .then(() => {
                    this.loading = false
                    this.listId = null
                })
        },

        hydrateSpaceTasks(view){
            this.loading = true;

            axiosIns
                .get(`view/${view.id}/task`)
                .then(res => {
                    const spaceId = view.parent.id

                    this.tasks.space[spaceId] = res.data.tasks
                })
                .finally(() => this.loading = false)
        },

        hydrateFolderTasks(view){
            this.loading = true;

            axiosIns
                .get(`view/${view.id}/task`)
                .then(res => {
                    const folderId = view.parent.id

                    this.tasks.folder[folderId] = res.data.tasks
                })
                .finally(() => this.loading = false)
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
            if(viewsStore.currentViewTab === 'list') this.listId = this.tasks.team.find(task => task.id === taskId).list.id;

            axiosIns
                .put(`/task/${taskId}`, payload)
                .then((res) => {
                    const editedTask = res.data


                    if(viewsStore.currentViewTab === 'board') this.hydrateSpaceTasks(viewsStore.currentView)
                    else this.getTask(editedTask.id) // task edit, doesn't return linked_tasks, so we need to use this instead... 

                    //all Tasks can be huge up to 200+ tasks or even more, always replace the edited part(faster)
                    this.tasks.team = this.tasks.team.map(task => task.id === editedTask.id ? editedTask : task)
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