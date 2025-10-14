<script setup>
import { FolderIcon, ListBulletIcon } from '@heroicons/vue/24/solid';
import { useSpaceStore } from '@/stores/spaceStore';
import { useFormsStore } from '@/stores/formsStore';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore();

const openCreateForm = (createFormName) => {
    formsStore.space = spaceStore.currentSpace;
    formsStore.toggleForm(createFormName)
}

</script>

<template>
    <div class="grid grid-cols-2 gap-10">
        <div v-if="spaceStore.getFolders.length">
            <h1 class="!ml-2 !mb-1 text-xl !font-medium">Folders</h1>
            <div class="rounded-lg min-h-[300px] p-2 grid grid-cols-2 auto-rows-min gap-2">
                <div v-for="folder in spaceStore.getFolders" @click="() => spaceStore.setCurrentFolder(folder, true)" class="rounded-sm border-2 border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-200 cursor-pointer flex items-center pl-2 place-self-start w-full py-2">
                    <span class="flex gap-2 items-center !font-medium"><FolderIcon class="w-5 h-5" /> {{ folder.name }}</span>
                </div>
            </div>
        </div>
        <div
            v-else
            class="w-[200px] text-center text-xl !font-medium rounded-sm border-3 border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-200 cursor-pointer pl-2  py-2"
            @click="() => openCreateForm('CreateFolder')"
        >
            Add Folder +
        </div>
        <div v-if="spaceStore.getFolderlessLists.length">
            <h1 class="!ml-2 !mb-1 text-xl !font-medium">Lists</h1>
            <div class="rounded-lg min-h-[300px] p-2 grid grid-cols-2 auto-rows-min gap-2">
                <div v-for="list in spaceStore.getFolderlessLists" @click="() => spaceStore.setCurrentList(list)" class="rounded-sm border-2 border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-200 cursor-pointer flex items-center pl-2 place-self-start w-full py-2">
                    <span class="flex gap-2 items-center !font-medium"><ListBulletIcon class="w-5 h-5" /> {{ list.name }}</span>
                </div>
            </div>
        </div>
        <div
            v-else
            class="w-[200px] h-fit text-center text-xl !font-medium rounded-sm border-3 border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-200 cursor-pointer pl-2  py-2"
            @click="() => openCreateForm('CreateList')"
            >
            Add List +
        </div>
    </div>
</template>