import axiosIns from "@/axios";

export const useSpaceStore = defineStore('SpaceStore',{
    state: () => ({
        spaces: [],
        currentSpace: null,
        currentFolder: null,
        folders: {},
        loadingState:{
            folders: false
        }
    }),

    actions: {
        hydrateSpaces(){
            axiosIns.get('team/90151303803/space').then(res => {
                    this.spaces = res.data.spaces;
            })
        },

        hydrateFolders(spaceId){
            this.loadingState.folders = true;

            axiosIns.get(`space/${spaceId}/folder`).then(res => {
                this.folders[spaceId] = res.data.folders
            }).finally(() => this.loadingState.folders = false)
        },

        setCurrentSpace(spaceId){
            this.currentSpace = this.spaces.find(space => space.id === spaceId)
        },

        setCurrentFolder(folder){
            this.currentFolder = folder;
            this.setCurrentSpace(folder.space.id)
        }
    }
})