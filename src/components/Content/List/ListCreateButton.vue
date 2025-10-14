<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const openListForm = () => {
    formsStore.space = spaceStore.currentSpace
    if(spaceStore.currentFolder) formsStore.setFormFolder(spaceStore.currentFolder)
    formsStore.toggleForm('CreateList')
}

</script>

<template>
    <div>
        <button @click="openListForm" class="flex items-center gap-1 cursor-pointer hover:text-gray-500 text-xl">
            <span class="!font-medium">Add List</span>
            <span class="text-3xl !mb-1">+</span>
        </button>
    </div>
</template>