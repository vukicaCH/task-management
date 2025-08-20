<script setup>
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';
import FolderMenu from './FolderMenu.vue';
import List from './List.vue';
import { useSpaceStore } from '@/stores/spaceStore';
import EditFolder from './Forms/Folder/Edit.vue';
import DeleteFolder from './Forms/Folder/Delete.vue';
import CreateList from './Forms/List/Create.vue';
import { Dialog } from 'primevue';

const props = defineProps({
    folder:{
        type: Object,
        required: true,
    }
})

const spaceStore = useSpaceStore()

const forms = {
    EditFolder,
    DeleteFolder,
    CreateList
}

const currentForm = ref('');
const header = computed(() => currentForm.value.replace(/([a-z])([A-Z])/g, '$1 $2'))

const folderLists = computed(() => spaceStore.folderLists[props.folder.id])

const open = ref(false);
const visible = ref(false);

const toggleFolderOpen = () => open.value = !open.value;

const openEditFolderForm = () => {
    visible.value = true;
    currentForm.value = 'EditFolder'
}

const openDeleteFolderForm = () => {
    visible.value = true;
    currentForm.value = 'DeleteFolder'
}

const openCreateListForm = () => {
    visible.value = true;
    currentForm.value = 'CreateList'
}

const closeForm = () => {
    visible.value = false;
}

onMounted(() => spaceStore.hydrateFolderLists(props.folder.id))
</script>

<template>
    <div class="flex gap-5">
        <div class="flex items-center gap-1">
            <FolderIcon class="w-4 h-4"/>
            <button @click="toggleFolderOpen">
                <ChevronRightIcon v-if="!open" class="w-3 h-3"/>
                <ChevronDownIcon v-else class="w-3 h-3"/>
            </button>
            <span>{{ folder.name }}</span>
        </div>

        <FolderMenu
            :folder="folder"
        />
    </div>

    <div v-if="open" class="pl-14">
        <div v-if="folderLists.length">
            <List v-for="list in folderLists" :list="list" />
        </div>
        <div v-else>
            <button @click="openCreateListForm">Add List +</button>
        </div>
    </div>

    
</template>