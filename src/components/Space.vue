<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import SpaceMenu from './SpaceMenu.vue';
import SpaceAddMenu from './SpaceAddMenu.vue';
import SpaceItems from './SpaceItems.vue';

const props = defineProps({
    space:{
        type: Object,
        required: true,
    }
})

const spaceStore = useSpaceStore();

const open = ref(false)

const toggleSpaceOpen = () => open.value = !open.value;

watch(()=> open.value, (val)=> spaceStore.currentSpace =  val ? props.space : null)
</script>

<template>
    <div class="flex gap-5">
        {{ space.name }}
        
        <div class="flex gap-2">
            <SpaceMenu :space="space" />
            <SpaceAddMenu :space="space" />
            <button @click="toggleSpaceOpen">
                <ChevronDownIcon v-if="!open" class="w-5 h-5"/>
                <ChevronUpIcon v-else class="w-5 h-5"/>
            </button>
        </div>
    </div>

    <div v-if="open">
        <SpaceItems :spaceId="space.id" />
    </div>
</template>