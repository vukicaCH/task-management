<script setup>
import EditFolder from './Forms/Folder/Edit.vue';
import DeleteFolder from './Forms/Folder/Delete.vue';
import { Dialog } from 'primevue';

const props = defineProps({
    currentForm:{
        type: String,
        required: true,
    },

    folder: {
        type: Object,
        required: true,
    }
})

const forms = {
    EditFolder,
    DeleteFolder
}

const refForm = toRef(props, 'currentForm');

</script>

<template>
    <component :is="forms[refForm]" :folder="folder" />
</template>    