<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import Folders from '../Folder/Folders.vue';
import Lists from '../List/Lists.vue';
import SpaceAddMenu from './SpaceAddMenu.vue';

const {space} = defineProps({
    space:{
        type: Object,
        required: true
    }
})

const spaceStore = useSpaceStore();

const folders = computed(()=> spaceStore.folders[space.id])
const lists = computed(() => spaceStore.lists.space[space.id])

const empty = computed(()=> !folders.value.length && !lists.value.length)
</script>

<template>
    <div>
        <div v-if="!empty" class="flex flex-col">
            <Folders :folders="folders" />
            <Lists :lists="lists" />
        </div>
        <div v-else class="flex items-center hover:bg-gray-700 rounded-lg p-1">
            <SpaceAddMenu :space />
        </div>
    </div>
</template>