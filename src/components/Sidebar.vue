<script setup>
import Space from './Space/Space.vue';
import SidebarSkeleton from './skeletons/SidebarSkeleton.vue';
import { useSpaceStore } from '@/stores/spaceStore';
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useFormsStore } from '@/stores/formsStore';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore()

onMounted(() => {
    spaceStore.hydrateSpaces()
})
</script>

<template>

    <div v-if="!spaceStore.loading" class="flex flex-col gap-3">
        <div class="flex justify-between items-center text-2xl text-white">
            <span class="!font-medium">Spaces</span>
            <button @click="formsStore.toggleForm('CreateSpace')" class="rounded-lg hover:bg-gray-700 p-1 cursor-pointer">
                <PlusIcon class="w-5 h-5" />
            </button>
        </div>

        <div class="p-2 flex flex-col gap-2">
            <Space v-for="space in spaceStore.spaces" :space="space" />
        </div>
    </div>

    <SidebarSkeleton v-else />
</template>