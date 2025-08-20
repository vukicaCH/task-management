<script setup>
import { Dialog } from 'primevue';
import { useFormsStore } from '@/stores/formsStore';
import EditFolder from './Folder/Edit.vue';
import DeleteFolder from './Folder/Delete.vue';
import CreateFolder from './Folder/Create.vue';
import CreateList from './List/Create.vue';
import EditList from './List/Edit.vue';
import DeleteList from './List/Delete.vue';

const formsStore = useFormsStore()

const forms = {
    CreateFolder,
    EditFolder,
    DeleteFolder,
    CreateList,
    CreateFolderlessList: CreateList,
    EditList,
    DeleteList,
}

const header = computed(() => formsStore.currentForm.replace(/([a-z])([A-Z])/g, '$1 $2'))

const dynamicProps = computed(() => {
    if(formsStore.currentForm === 'CreateFolderlessList') {
        return {folderless: true}
    }
})
</script>

<template>
    <Dialog v-model:visible="formsStore.formVisible" :header="header" modal>
        <component :is="forms[formsStore.currentForm]" v-bind="dynamicProps" />
    </Dialog>    
</template>