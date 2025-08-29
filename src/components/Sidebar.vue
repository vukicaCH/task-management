<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import Space from './Space.vue';
import Create from './Space/Forms/Create.vue';
import { Dialog } from 'primevue';
import { PlusIcon } from '@heroicons/vue/24/outline'

const spaceStore = useSpaceStore();

const visible = ref(false)

const openCreateSpaceForm = () => visible.value = true;

onMounted(() => {
    spaceStore.hydrateSpaces()
})
</script>

<template>

    <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center text-2xl text-white">
            <span>Spaces</span>
            <button @click="openCreateSpaceForm" class="rounded-lg hover:bg-gray-700 p-1 cursor-pointer">
                <PlusIcon class="w-5 h-5" />
            </button>
        </div>

        <div v-if="!spaceStore.loading" class="border border-white rounded-lg p-2 flex flex-col gap-2">
            <Space v-for="space in spaceStore.spaces" :space="space" />
        </div>
        <div v-else>Loading...</div>
    </div>

    <Dialog v-model:visible="visible" modal header="Create Space">
        <Create @close="() => visible = false" />
    </Dialog>
</template>