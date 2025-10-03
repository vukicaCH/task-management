import axiosIns from "@/axios";
import { useSpaceStore } from "./spaceStore";

export const useViewsStore = defineStore('ViewsStore',() => {
    const views = reactive({
        space: {},
        folder: {},
        list:{}
    })

    const currentView = ref();

    const currentViewTab = ref('overview')

    const spaceStore = useSpaceStore();

    const setView = (parent, parentId) => {

        if(views[parent][parentId]) return

        axiosIns
            .get(`${parent}/${parentId}/view`)
            .then(res => {

                const view = res.data.views.find(view => view.type === 'board');

                if(view){
                    views[parent][parentId] = view;
                    currentView.value = view;
                }else{
                    createView(parent, parentId)
                }
            })
    }

    const createView = (parent, parentId) => {
        axiosIns
            .post(`${parent}/${parentId}/view`,
                {
                    type: 'board',
                    filters:{show_closed: true},
                    settings : {show_subtasks : 2, show_closed_subtasks: false}
                }
            )
            .then((res) => {
                views[parent][parentId] = res.data.view
                currentView.value = res.data.view;
            })
    }

    watch(
        () => spaceStore.currentTypeId,
        () => setView(spaceStore.currentType, spaceStore.currentTypeId),
        {immediate: true}
    )

    return {
        views,
        currentView,
        currentViewTab,
        createView,
    }
})