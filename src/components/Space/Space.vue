<script setup>
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import SpaceMenu from './SpaceMenu.vue';
import SpaceItems from './SpaceItems.vue';
import { useSpaceStore } from '@/stores/spaceStore';

const {space} = defineProps({
    space:{
        type: Object,
        required: true,
    }
})

const spaceStore = useSpaceStore()

const open = ref(false)
const hovered = ref(false)

const toggleSpaceOpen = () => open.value = !open.value;

const openSpace = () => {
    open.value = true
    spaceStore.setCurrentSpace(space.id, true)
}
</script>

<template>
    <div>
        <div class="grid grid-cols-8">
            <div
                class="grid grid-cols-8 col-span-8 row-span-1 cursor-pointer items-center relative bg-gray-800 rounded-lg p-1"
                @mouseover="hovered=true"
                @mouseleave="hovered=false"
            >
                <div @click="toggleSpaceOpen" class="col-span-1">
                    <div
                        class="flex items-center justify-center text-white"
                    >
                        <div v-if="!hovered" class="!font-medium">{{ space.name.charAt(0) }}</div>
                        <button v-else class="!mr-1 w-full h-full flex items-center py-1 justify-center cursor-pointer rounded-lg hover:bg-gray-500">
                            <ChevronRightIcon v-if="!open" class="w-4 h-4"/>
                            <ChevronDownIcon v-else class="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                <div @click="openSpace" class="col-span-5 !font-medium">
                    {{ space.name }}
                </div> 
                <div class="flex gap-1 col-span-2 justify-self-end">
                    <SpaceMenu :space="space" />
                </div>
            </div>
            <div class="col-start-2 col-end-9">
                <div v-if="open">
                    <SpaceItems :space="space" />
                </div>
            </div>
        </div>
    </div>
</template>