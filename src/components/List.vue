<script setup>
import { ListBulletIcon } from '@heroicons/vue/24/solid';
import ListMenu from './ListMenu.vue';

const props = defineProps({
    list:{
        type: Object,
        required: true,
    },
})
</script>

<template>
    <div class="flex gap-5">
        <div class="flex items-center gap-2">
            <ListBulletIcon class="w-4 h-4"/>
            <span>{{ list.name }}</span>
        </div>

        <ListMenu :list="list" />
    </div>
</template>