<script setup>
import { FolderIcon, ListBulletIcon } from '@heroicons/vue/24/solid';
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore();
</script>

<template>
    <div class="grid grid-cols-2 gap-10">
        <div>
            <h1 class="!ml-2 !mb-1 text-xl">Folders</h1>
            <div class="rounded-lg border-2 border-white min-h-[300px] p-2 grid grid-cols-2 gap-2">
                <div v-for="folder in spaceStore.getFolders" @click="() => spaceStore.setCurrentFolder(folder, true)" class="rounded-sm border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-200 cursor-pointer flex items-center pl-2 place-self-start w-full py-2">
                    <span class="flex gap-2 items-center"><FolderIcon class="w-5 h-5" /> {{ folder.name }}</span>
                </div>
            </div>
        </div>
        <div>
            <h1 class="!ml-2 !mb-1 text-xl">Lists</h1>
            <div class="rounded-lg border-2 border-white min-h-[300px] p-2 grid grid-cols-2 gap-2">
                <div v-for="list in spaceStore.getFolderlessLists" @click="() => spaceStore.setCurrentList(list)" class="rounded-sm border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-200 cursor-pointer flex items-center pl-2 place-self-start w-full py-2">
                    <span class="flex gap-2 items-center"><ListBulletIcon class="w-5 h-5" /> {{ list.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>