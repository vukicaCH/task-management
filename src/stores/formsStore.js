

export const useFormsStore = defineStore('FormsStore',{
    state: ()=> ({
        currentForm: null,
        formVisible: false,
        task: {}
    }),

    actions:{
        toggleForm(currentForm = null){
            this.currentForm = currentForm;
            this.formVisible = !this.formVisible
        }
    }
})