<script setup>
import Popover from 'primevue/popover';
import { Button } from 'primevue';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    tag:{
        type:Object,
        required: true
    }
})

const hovered = ref(false)
</script>

<template>
    <div
        class="rounded-md px-2.5 py-1 text-xs"
        :style="{backgroundColor: tag.tag_bg}"
        @mouseover="hovered=true"
        @mouseleave="hovered=false"
    >
        <div v-if="!hovered">{{ tag.name }}</div>
        <div v-else><EllipsisHorizontalIcon class="w-4 h-4"/></div>
    </div>
</template>