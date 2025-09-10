<script setup>
import EditLinkedTasks from './Task/EditLinkedTasks.vue';
import { Dialog } from 'primevue';
import { useFormsStore } from '@/stores/formsStore';

const formsStore = useFormsStore()

const forms = {
    EditLinkedTasks
}

</script>

<template>
    <Dialog v-model:visible="formsStore.formVisible" modal header="Sogdian">
        <component :is="forms[formsStore.currentForm]" />
    </Dialog>
</template>