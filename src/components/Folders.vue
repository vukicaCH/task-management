<script setup>
import Folder from './Folder.vue';

const props = defineProps({
    folders:{
        type: Array,
        required: true
    }
})
</script>


<template>
    <Folder v-for="folder in folders" :folder="folder" />
</template>