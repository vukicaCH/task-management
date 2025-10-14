<script setup>
import { ListBulletIcon } from '@heroicons/vue/24/solid';
import { useSpaceStore } from '@/stores/spaceStore';
import ListMenu from './ListMenu.vue';

const {list} = defineProps({
    list:{
        type: Object,
        required: true,
    },
})

const spaceStore = useSpaceStore();

</script>

<template>
    <div>
        <div class="grid grid-cols-8 !mt-1">
            <div
                class="grid grid-cols-8 col-span-8 row-span-1 cursor-pointer items-center relative rounded-lg py-1 pr-1"
            >
                <div class="col-span-1">
                    <div
                        class="flex items-center justify-center text-white"
                    >
                        <ListBulletIcon class="w-4 h-4"/>
                    </div>
                </div>
                <div @click="() => spaceStore.setCurrentList(list)" class="col-span-5 !font-medium">
                    {{ list.name }}
                </div> 
                <div class="flex gap-1 col-span-2 justify-self-end">
                    <ListMenu :list />
                </div>
            </div>
        </div>
    </div>
</template>