import axiosIns from "@/axios";
import { useSpaceStore } from "./spaceStore";

export const useViewsStore = defineStore('ViewsStore',() => {
    const views = reactive({
        space: {},
        folder: {},
        list: {}
    })

    const currentView = ref();

    const currentViewTab = ref('overview')

    const spaceStore = useSpaceStore();

    const getSpaceView = (spaceId, type) => {

        if(!(type in views.space)) views.space[type] = {}

        axiosIns
            .get(`space/${spaceId}/view`)
            .then(res => {

                //console.log(res.data)

                const view = res.data.views.find(view => view.type === type);

                if(view){
                    views.space[type][spaceId] = view;
                    currentView.value = view;
                }else{
                    createView('space',spaceId, type)
                }
            })
    }

    const getFolderView = (folderId, type) => {
        if(!(type in views.folder)) views.folder[type] = {}

        axiosIns
            .get(`folder/${folderId}/view`)
            .then(res => {

                //console.log(res.data)

                const view = res.data.views.find(view => view.type === type);

                if(view){
                    views.folder[type][folderId] = view;
                    currentView.value = view;
                }else{
                    createView('folder', folderId, type)
                }
            })
    }

    const getListView = (listId, type) => {
        if(!(type in views.list)) views.list[type] = {}

        axiosIns
            .get(`list/${listId}/view`)
            .then(res => {

                //console.log(res.data)

                const view = res.data.views.find(view => view.type === type);

                if(view){
                    views.list[type][listId] = view;
                    currentView.value = view;
                }else{
                    createView('list', listId, type)
                }
            })
    }

    const createView = (parentType, parentId, type) => {
        axiosIns
            .post(`${parentType}/${parentId}/view`,{type: type, filters:{show_closed: true}, settings : {show_subtasks : 2, show_closed_subtasks: false}})
            .then((res) => {

                console.log(res)

                if(!(type in views[parentType])) views[parentType][type] = {}

                views[parentType][type][parentId] = res.data.view
                currentView.value = res.data.view;
            })
    }

    watch(
        () => [spaceStore.currentSpace, spaceStore.currentFolder, spaceStore.currentList],
        () => {
            if(spaceStore.currentList){
                const listId = spaceStore.currentList.id

                getListView(listId, 'board')

                return;
            }

            if(spaceStore.currentFolder){
                const folderId = spaceStore.currentFolder.id

                getFolderView(folderId, 'board')

                return;
            }

            if(spaceStore.currentSpace){
                const spaceId = spaceStore.currentSpace.id

                getSpaceView(spaceId, 'board')
            }
        },
        {immediate: true}
    )



    return {
        views,
        currentView,
        currentViewTab,
        createView,
        getSpaceView,
    }
})