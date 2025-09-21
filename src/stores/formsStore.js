

export const useFormsStore = defineStore('FormsStore',{
    state: ()=> ({
        currentForm: null,
        formVisible: false,
        task: {},
        tag:{}
    }),

    actions:{
        toggleForm(currentForm = null){
            this.currentForm = currentForm;
            this.formVisible = !this.formVisible
        }
    }
}) 