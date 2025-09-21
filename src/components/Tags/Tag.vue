<script setup>
import TagMenu from './TagMenu.vue';

const props = defineProps({
    tag:{
        type:Object,
        required: true
    },

    includeMenu:{
        type: Boolean,
        required: false,
        default: false,
    }
})

const emit = defineEmits(['trigger-edit','open-popover'])

const hovered = ref(false)
</script>

<template>
    <div
        class="rounded-md text-xs w-[100px] min-h-[30px] flex items-center"
        :style="{backgroundColor: tag.tag_bg}"
        @mouseover="hovered=true"
        @mouseleave="hovered=false"
    >
        <div v-if="!hovered || !includeMenu" class="w-full text-center">
            <span class="!font-bold">{{ tag.name }}</span>
        </div>
        <div v-else class="flex-1">
            <TagMenu :tag="tag" />
        </div>
    </div>
</template>