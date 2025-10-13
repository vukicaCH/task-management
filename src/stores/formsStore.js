export const useFormsStore = defineStore('FormsStore',{
    state: ()=> ({
        currentForm: null,
        formVisible: false,
        space: null,
        folder: null,
        list: null,
        task: {},
        tag:{}
    }),

    actions:{
        toggleForm(currentForm = null){
            this.currentForm = currentForm;
            this.formVisible = !this.formVisible
            this.space = null;
            this.folder = null;
            this.list = null;
        },

        setFormSpace(space){
            this.space = space;
        },

        setFormFolder(folder){
            this.folder = folder;
        },

        setFormList(list){
            this.list = list;
        }
    }
}) 