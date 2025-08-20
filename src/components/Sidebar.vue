<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import useForms from '@/composables/useForms';
import Space from './Space.vue';
import Dialog from 'primevue/dialog';
import { useFormsStore } from '@/stores/formsStore';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore();

const openCreateSpaceForm = () => {
    formsStore.toggleForm('CreateSpace', 'Create a Space')
}

onMounted(() => {
    spaceStore.hydrateSpaces()
})
</script>

<template>

    <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center text-2xl bg-white text-black">
            <div>Spaces</div>
            <div class="bg-red-500" @click="openCreateSpaceForm">+</div>
        </div>

        <Space v-for="space in spaceStore.spaces" :space="space" />
    </div>
</template>