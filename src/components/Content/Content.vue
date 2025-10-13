<script setup>
import Breadcrumbs from './Breadcrumbs.vue';
import Tabs from './Tabs.vue';
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore();
</script>

<template>
    <div v-if="spaceStore.ready">
        <div v-if="spaceStore.currentSpace" class="border-y-4 border-opacity-0 p-3 ">
            <Breadcrumbs />
            <Tabs />
        </div>
        <div v-else>Select space, folder or list to see content.</div>
    </div>
    <div v-else>Loading...</div>
</template>