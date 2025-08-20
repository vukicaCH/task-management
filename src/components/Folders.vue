<script setup>
import Folder from './Folder.vue';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    spaceId:{
        type: String,
        required: true
    }
})

const spaceStore = useSpaceStore()
</script>


<template>
    <Folder v-for="folder in spaceStore.folders[spaceId]" :folder="folder" />
</template>