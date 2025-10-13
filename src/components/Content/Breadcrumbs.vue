<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { useViewsStore } from '@/stores/viewsStore';

const spaceStore = useSpaceStore();
const viewsStore = useViewsStore()

const tabs = computed(() => spaceStore.currentType === 'space' ? ['overview', 'list', 'board'] : ['list', 'board'])
</script>

<template>
    <div class="border-y-3 py-2.5">
        <div class="flex gap-2 !mb-1">
            <span class="!font-medium" v-if="spaceStore.currentSpace">{{ spaceStore.currentSpace.name }}</span>
            <span class="!font-medium" v-if="spaceStore.currentFolder"> > {{ spaceStore.currentFolder.name }}</span>
            <span class="!font-medium" v-if="spaceStore.currentList"> > {{ spaceStore.currentList.name }}</span>
        </div>

        <div class="flex gap-1">
            <div
                v-for="tab in tabs"
                @click="viewsStore.currentViewTab = tab"
                class="w-[100px] h-[45px] hover:bg-gray-700 cursor-pointer flex justify-center items-center rounded-md border-2 !font-medium"
                :class="{'border-white text-white' : tab === viewsStore.currentViewTab}"
                >
                {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </div>
        </div>
    </div>
</template>