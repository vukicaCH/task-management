<script setup>
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';
import FolderMenu from './FolderMenu.vue';
import List from './List.vue';
import Form from './Folder/Forms/Form.vue';
import { Dialog } from 'primevue';
import { useSpaceStore } from '@/stores/spaceStore';
import FolderAddMenu from './FolderAddMenu.vue';

const props = defineProps({
    folder:{
        type: Object,
        required: true,
    }
})

const spaceStore = useSpaceStore()

const open = ref(false);
const hovered = ref(false);
const visible = ref(false)
const currentForm = ref('')

const lists = computed(() => spaceStore.lists.folder[props.folder.id])

const toggleFolderOpen = () => open.value = !open.value

const setCurrentFolder = () => {
    open.value = true
    spaceStore.setCurrentFolder(props.folder, true)
}

const openCurrentForm = (formName) => {
    currentForm.value = formName
    visible.value = true
}

const closeCurrentForm = () => visible.value = false;

provide('close', closeCurrentForm)
provide('open', openCurrentForm)

const header = computed(() => {
    if(currentForm.value === 'Create') return 'Create List'

    return `${currentForm.value} Folder`
})
</script>

<template>
    <div>
        <div class="grid grid-cols-8">
            <div
                class="grid grid-cols-8 col-span-8 row-span-1 cursor-pointer items-center relative hover:bg-gray-700 rounded-lg p-1"
                @mouseover="hovered=true"
                @mouseleave="hovered=false"
            >
                <div @click="toggleFolderOpen" class="col-span-1">
                    <div
                        class="flex items-center justify-center text-white"
                    >
                        <div v-if="!hovered"><FolderIcon class="w-4 h-4"/></div>
                        <button v-else class="!mr-1 w-full h-full flex items-center py-1 justify-center cursor-pointer rounded-lg hover:bg-gray-500">
                            <ChevronRightIcon v-if="!open" class="w-4 h-4"/>
                            <ChevronDownIcon v-else class="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                <div @click="setCurrentFolder" class="col-span-5">
                    {{ folder.name }}
                </div> 
                <div class="flex gap-1 col-span-2 justify-self-end">
                    <FolderMenu />
                </div>
            </div>
            <div class="col-start-2 col-end-9">
                <div v-if="open">
                    <div v-if="lists.length">
                        <List v-for="list in lists" :list="list" />
                    </div>
                    <div v-else class="flex items-center hover:bg-gray-700 rounded-lg p-1">
                        <FolderAddMenu />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal :header="header">
        <Form :current-form="currentForm" :folder="folder" />
    </Dialog>
</template>