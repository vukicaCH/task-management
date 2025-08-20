export const useFormsStore = defineStore('FormsStore',{
    state: () => ({
        currentForm: null,
        formVisible: false,
        formHeader: null
    }),

    actions: {
        toggleForm(currentForm = null, formHeader = null){
            this.formVisible = !this.formVisible;
            this.currentForm = currentForm;
            this.formHeader = formHeader
        }
    }
})