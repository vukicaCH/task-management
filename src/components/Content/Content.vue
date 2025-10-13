<script setup>
import Breadcrumbs from './Breadcrumbs.vue';
import Tabs from './Tabs.vue';
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore();
</script>

<template>
    <div v-if="spaceStore.ready">
        <div v-if="spaceStore.currentSpace">
            <Breadcrumbs />
            <Tabs />
        </div>
        <div v-else>Select space, folder or list to see content.</div>
    </div>
    <div v-else>Loading...</div>
</template>