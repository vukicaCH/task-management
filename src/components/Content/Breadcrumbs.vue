<script setup>
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore();
</script>

<template>
    <div class="flex gap-2 py-2">
        <div v-if="spaceStore.currentSpace">{{ spaceStore.currentSpace.name }}</div>
        <div v-if="spaceStore.currentFolder"> > {{ spaceStore.currentFolder.name }}</div>
        <div v-if="spaceStore.currentList"> > {{ spaceStore.currentList.name }}</div>
    </div>
</template>