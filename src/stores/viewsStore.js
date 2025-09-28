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

    const createView = (parentType, parentId, type) => {
        axiosIns
            .post(`${parentType}/${parentId}/view`,{type: type, filters:{show_closed: true}, settings : {show_subtasks : 2, show_closed_subtasks: false}})
            .then((res) => {
                if(!(type in views[parentType])) views[parentType][type] = {}

                views[parentType][type][parentId] = res.data.view
                currentView.value = res.data.view;
            })
    }

    watch(
        () => spaceStore.currentSpace,
        () => {
            const spaceId = spaceStore.currentSpace.id

            getSpaceView(spaceId, 'board')

    },{immediate: true})

    return {
        views,
        currentView,
        currentViewTab,
        createView,
        getSpaceView,
    }
})