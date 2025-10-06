<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import ColumnChooser from './ColumnChooser.vue';
import TreePanel from './TreePanel.vue';

const spaceStore = useSpaceStore()
</script>

<template>
    <div class="!space-y-2">
        <ColumnChooser />
        <TreePanel v-for="list in spaceStore.getLists" :list />
    </div>
</template>