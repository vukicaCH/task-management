<script setup>
import List from './List.vue';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    spaceId:{
        type: String,
        required: true
    }
})

const spaceStore = useSpaceStore();
</script>

<template>
    <List v-for="list in spaceStore.lists[spaceId]" :list="list" />
</template>