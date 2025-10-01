import axiosIns from "@/axios";
import { useSpaceStore } from "./spaceStore";

export const useViewsStore = defineStore('ViewsStore',() => {
    const views = reactive({
        space: {
            board: {},
            list: {}
        },
        folder: {
            board: {},
            list: {}
        },
        list: {
            board: {},
            list: {}
        }
    })

    const currentView = ref();

    const currentViewTab = ref('overview')

    const spaceStore = useSpaceStore();

    const setView = (parent, parentId, type) => {
        axiosIns
            .get(`${parent}/${parentId}/view`)
            .then(res => {

                const view = res.data.views.find(view => view.type === type);

                if(view){
                    views[parent][type][parentId] = view;
                    currentView.value = view;
                }else{
                    createView(parent, parentId, type)
                }
            })
    }

    const createView = (parent, parentId, type) => {
        axiosIns
            .post(`${parent}/${parentId}/view`,
                {
                    type: type,
                    filters:{show_closed: true},
                    settings : {show_subtasks : 2, show_closed_subtasks: false}
                }
            )
            .then((res) => {
                views[parent][type][parentId] = res.data.view
                currentView.value = res.data.view;
            })
    }

    watch(
        () => [spaceStore.currentTypeId, currentViewTab.value],
        () => {
            if(currentViewTab.value !== 'overview'){
                setView(spaceStore.currentType, spaceStore.currentTypeId, currentViewTab.value)
            }
        },
        {immediate: true}
    )

    return {
        views,
        currentView,
        currentViewTab,
        createView,
    }
})