<script setup>
import Space from './Space/Space.vue';
import SidebarSkeleton from './skeletons/SidebarSkeleton.vue';
import { useSpaceStore } from '@/stores/spaceStore';
import { useFormsStore } from '@/stores/formsStore';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore()

onMounted(() => {
    spaceStore.hydrateSpaces()
})
</script>

<template>

    <div v-if="!spaceStore.loading" class="flex flex-col gap-3">
        <div class="flex justify-between items-center text-white">
            <span class="!font-medium text-2xl">Spaces</span>
            <button
                @click="formsStore.toggleForm('CreateSpace')"
                class="rounded-lg bg-gray-700 hover:text-gray-400 px-2 py-1 cursor-pointer flex items-center gap-2 !font-medium"
            >
               Add Space
            </button>
        </div>

        <div class="p-2 flex flex-col gap-2">
            <Space v-for="space in spaceStore.spaces" :space="space" />
        </div>

        <button
            @click="formsStore.toggleForm('ComingUpNext')"
            class="rounded-lg bg-gray-700 hover:text-gray-400 px-2 py-1 w-fit cursor-pointer flex items-center gap-2 !font-medium"
        >
            Coming up next
        </button>
    </div>

    <SidebarSkeleton v-else />
</template>