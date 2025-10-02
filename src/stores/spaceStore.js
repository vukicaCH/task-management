import axiosIns from "@/axios";
import { useViewsStore } from "./viewsStore";

export const useSpaceStore = defineStore('SpaceStore',{
    state: () => ({
        spaces: [],
        currentSpace: null,
        currentFolder: null,
        currentList: null,
        currentType: null,
        currentTypeId: null,
        folders: {},
        lists: {
            space:{},
            folder:{}
        },
        loading: false,
        ready: false,
        views:{
            space: {}
        },
        tags:{},
    }),

    actions: {
        async hydrateSpaces(){

            this.loading = true;

            return axiosIns
                        .get('team/90151303803/space')
                        .then(res => this.spaces = res.data.spaces)
                        .then(() => {
                            return Promise.allSettled(this.spaces.map( async space => await this.hydrateSpaceItems(space.id)))
                        }).then(() => {
                            this.setCurrentSpace(this.spaces[0].id);
                            this.loading = false
                            this.ready = true;
                        })
        },

        async hydrateFolders(spaceId){
            return axiosIns
                    .get(`space/${spaceId}/folder`)
                    .then(res => {
                        this.folders[spaceId] = res.data.folders;

                        this.folders[spaceId].forEach(folder => {
                            this.lists.folder[folder.id] = folder.lists.map(list => {
                                const {name, id, hidden} = folder

                                return {
                                    ...list,
                                    folder : {name, id, hidden}
                                }
                            })
                        }) // IN ORDER TO REDUCE THE INITIAL NUMBER OF CALLS, I WROTE THIS
                    })
        },

        async hydrateLists(spaceId){
            return axiosIns
                        .get(`space/${spaceId}/list`)
                        .then(res => this.lists.space[spaceId] = res.data.lists)
        },

        async hydrateFolderLists(folderId){
            return axiosIns
                        .get(`folder/${folderId}/list`)
                        .then(res => {
                            this.lists.folder[folderId] = res.data.lists
                        })
        },

        async hydrateSpaceItems(spaceId){
            return Promise.allSettled([this.hydrateFolders(spaceId), this.hydrateLists(spaceId)])
        },

        setCurrentSpace(spaceId, deleteCurrentFolderAndList = false){
            this.currentSpace = this.spaces.find(space => space.id === spaceId)

            this.currentType = 'space';
            this.currentTypeId = spaceId;

            if(deleteCurrentFolderAndList){
                this.currentFolder = null;
                this.currentList = null;
            }

            if(!(spaceId in this.tags)){
                this.hydrateSpaceTags(spaceId)
            }
        },

        setCurrentFolder(folder, deleteCurrentList = false){
            this.currentFolder = folder;
            this.setCurrentSpace(folder.space.id)

            this.currentType = 'folder';
            this.currentTypeId = folder.id;

            const viewsStore = useViewsStore();

            if(viewsStore.currentViewTab === 'overview') viewsStore.currentViewTab = 'list'

            if(deleteCurrentList) this.currentList = null;
        },

        setCurrentList(list){
            this.currentList = list;
            this.setCurrentSpace(list.space.id)

            const viewsStore = useViewsStore();

            if(viewsStore.currentViewTab === 'overview') viewsStore.currentViewTab = 'list'

            const folderless = list.folder.hidden

            if(folderless){
                this.currentFolder = null;
            }else{
                this.currentFolder = this.folders[list.space.id].find(folder => folder.id === list.folder.id)
            }

            this.currentType = 'list';
            this.currentTypeId = list.id;
        },

        addListToFolder(list){
            const folderId = list.folder.id;

            this.lists.folder[folderId].push(list)
        },

        addListToSpace(list){
            const spaceId = list.space.id;

            if(spaceId in this.lists.space) this.lists.space[spaceId].push(list)
            else this.lists.space[spaceId] = [list]
        },

        removeListFromSpace(list){
            const {id, space} = list

            this.lists.space[space.id] = this.lists.space[space.id].filter(list => list.id !== id)

            if(this.currentList === list) this.currentList = null;
        },

        removeListFromFolder(list){

            const {id, folder} = list;

            this.lists.folder[folder.id] = this.lists.folder[folder.id].filter(list => list.id !== id)

            if(this.currentList === list) this.currentList = null;
        },

        addFolder(folder){
            const spaceId = folder.space.id;

            if(spaceId in this.folders) this.folders[spaceId].push(folder)
            else this.folders[spaceId] = [folder]

            this.lists.folder[folder.id] = []
        },

        removeFolder(folder){
            this.folders[folder.space.id] = this.folders[folder.space.id].filter(folderItem => folderItem.id !== folder.id)

            delete this.lists.folder[folder.id]

            if(folder === this.currentFolder) this.currentFolder = null;
            if(this.currentList?.folder.id === folder.id) this.currentList = null;
        },

        replaceFolder(folder){
            const index = this.folders[this.currentSpace.id].findIndex((folderItem) => folderItem.id === folder.id);

            this.folders[this.currentSpace.id][index] = folder;

            if(folder.lists.length) {
                if(this.currentList?.folder?.id === folder.id) this.currentList.folder = {...folder}
                return this.hydrateFolderLists(folder.id)
            }
        },

        addSpace(space){
            this.spaces.push(space)

            this.folders[space.id] = []
            this.lists.space[space.id] = []
        },

        removeSpace(spaceId){
            this.spaces = this.spaces.filter(space => space.id !== spaceId);
            delete this.lists.space[spaceId];
            this.folders[spaceId].forEach(folder => this.removeFolder(folder))

            if(this.currentSpace?.id === spaceId) this.currentSpace = null
        },

        async replaceSpace(space){
            const index = this.spaces.findIndex((spaceItem) => spaceItem.id === space.id);

            this.spaces[index] = space

            return this.hydrateSpaceItems(space.id)
        },

        getSpaceView(){

            axiosIns
                .get(`${this.currentType}/${this.currentTypeId}/view`)
                .then((res) => {

                    res.data.views.forEach(async view => await axiosIns.delete(`view/${view.id}`))

                    // const boardView = res.data.views.find(view => view.type === 'board')

                    // if(boardView){
                    //     this.views.space[spaceId] = boardView
                    // }else{
                    //     this.createSpaceView(spaceId)
                    // }
                })
        },

        createSpaceView(spaceId){
            axiosIns
                .post(`space/${spaceId}/view`,{type: 'board', filters:{show_closed: true}})
                .then(res => this.views.space[spaceId] = res.data.view)
        },

        hydrateSpaceTags(spaceId){
            axiosIns
                .get(`space/${spaceId}/tag`)
                .then(res => this.tags[spaceId] = res.data.tags)
        },

        deleteSpaceTag(spaceId, tagName){

            axiosIns
                .delete(`space/${spaceId}/tag/${tagName}`)
                .then(() => this.tags[spaceId] = this.tags[spaceId].filter(tag => tag.name !== tagName))
        }
    },

    getters:{
        getFolders: (state) => state.folders[state.currentSpace.id],

        getLists(state){
            if(state.currentList) return [state.currentList] 
            else if(state.currentFolder) return state.lists.folder[state.currentFolder.id]
            else{
                const folderLists = this.getFolders.flatMap(folder => state.lists.folder[folder.id])
                const folderlessLists = state.lists.space[state.currentSpace.id]
                

                return [...folderLists, ...folderlessLists]  
            }
        },

        getFolderlessLists: (state) => state.lists.space[state.currentSpace.id]
    }
})