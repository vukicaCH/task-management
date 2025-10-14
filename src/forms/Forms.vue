<script setup>
import { Dialog } from 'primevue';
import { useFormsStore } from '@/stores/formsStore';
import CreateSpace from './Space/Create.vue';
import EditSpace from './Space/Edit.vue';
import DeleteSpace from './Space/Delete.vue';
import CreateFolder from './Folder/Create.vue';
import EditFolder from './Folder/Edit.vue';
import DeleteFolder from './Folder/Delete.vue';
import CreateList from './List/Create.vue';
import EditList from './List/Edit.vue';
import DeleteList from './List/Delete.vue';
import CreateDocument from './Document/Create.vue';
import ComingUpNext from './ComingUpNext.vue';

const formsStore = useFormsStore()

const forms = {
    CreateSpace,
    EditSpace,
    DeleteSpace,
    CreateFolder,
    EditFolder,
    DeleteFolder,
    CreateList,
    EditList,
    DeleteList,
    CreateDocument,
    ComingUpNext
}

const formsHeader = (formName) => formName?.replace(/([A-Z])/g, ' $1')

</script>

<template>
    <Dialog
        v-model:visible="formsStore.formVisible"
        modal
        :header="formsHeader(formsStore.currentForm)"
        class="w-[300px]"
    >
        <component :is="forms[formsStore.currentForm]" />
    </Dialog>
</template>