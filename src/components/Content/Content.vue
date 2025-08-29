<script setup>
import Breadcrumbs from './Breadcrumbs.vue';
import Tabs from './Tabs.vue';
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore();
</script>

<template>
    <div v-if="!spaceStore.loading" class="rounded-lg border border-white p-3">
        <Breadcrumbs />
        <Tabs />
    </div>
    <div v-else>Loading...</div>
</template>