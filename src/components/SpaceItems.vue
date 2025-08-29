<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import Folders from './Folders.vue';
import Lists from './Lists.vue';
import SpaceAddMenu from './SpaceAddMenu.vue';
import CreateList from './List/Forms/Create.vue';
import CreateFolder from './Folder/Forms/Create.vue';
import { Dialog } from 'primevue';
import { PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    spaceId:{
        type: String,
        required: true
    }
})

const spaceStore = useSpaceStore();

const folders = computed(()=> spaceStore.folders[props.spaceId])
const lists = computed(() => spaceStore.lists.space[props.spaceId])

const empty = computed(()=> !folders.value.length && !lists.value.length)

const currentForm = ref('')

const forms = {CreateFolder, CreateList}

const visible = ref(false)

const openCurrentForm = (formName) => {
    currentForm.value = formName
    visible.value = true
}

const space = computed(() => spaceStore.spaces.find(space => space.id === props.spaceId))

const closeCurrentForm = () => visible.value = false;

provide('close', closeCurrentForm)
provide('open', openCurrentForm)

const header = computed(() => currentForm.value.replace(/([A-Z])/g, ' $1'))
</script>

<template>
    <div>
        <div v-if="!empty" class="flex flex-col">
            <Folders :folders="folders" />
            <Lists :lists="lists" />
        </div>
        <div v-else class="flex items-center hover:bg-gray-700 rounded-lg p-1">
            <SpaceAddMenu />
        </div>
    </div>

    <Dialog v-model:visible="visible" modal :header="header">
        <component :is="forms[currentForm]" :space="space" />
    </Dialog>
</template>