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

    const setView = async (parent, parentId) => {

        if(views[parent][parentId]) return

        await axiosIns
            .get(`${parent}/${parentId}/view`)
            .then(async res => {

                console.log(res)

                const view = res.data.views[0];

                if(view){
                    views[parent][parentId] = view;
                }else{
                    await createView(parent, parentId)
                }
            })
    }

    const createView = async (parent, parentId) => {

        const data = {
            type: 'board',
            filters:{show_closed: true},
            settings : {show_subtasks : 2, show_closed_subtasks: true}
        }       

        await axiosIns
            .post(`${parent}/${parentId}/view`,data)
            .then((res) => views[parent][parentId] = res.data.view)
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
        setView
    }
})