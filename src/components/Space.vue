<script setup>
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import SpaceMenu from './SpaceMenu.vue';
import SpaceItems from './SpaceItems.vue';
import Form from './Space/Forms/Form.vue';
import { Dialog } from 'primevue';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    space:{
        type: Object,
        required: true,
    }
})

const spaceStore = useSpaceStore()

const open = ref(false)
const hovered = ref(false)
const visible = ref(false)
const currentForm = ref('')

const toggleSpaceOpen = () => open.value = !open.value;

const openSpace = () => {
    open.value = true
    spaceStore.setCurrentSpace(props.space.id, true)
}

const openCurrentForm = (formName) => {
    currentForm.value = formName
    visible.value = true
}

const closeCurrentForm = () => visible.value = false;

provide('close', closeCurrentForm)
provide('open', openCurrentForm)

const header = computed(() => {
    if(currentForm.value.startsWith('Create')) return currentForm.value.replace(/([A-Z])/g, ' $1')

    return `${currentForm.value} Space`
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
                <div @click="toggleSpaceOpen" class="col-span-1">
                    <div
                        class="flex items-center justify-center text-white"
                    >
                        <div v-if="!hovered">{{ space.name.charAt(0) }}</div>
                        <button v-else class="!mr-1 w-full h-full flex items-center py-1 justify-center cursor-pointer rounded-lg hover:bg-gray-500">
                            <ChevronRightIcon v-if="!open" class="w-4 h-4"/>
                            <ChevronDownIcon v-else class="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                <div @click="openSpace" class="col-span-5">
                    {{ space.name }}
                </div> 
                <div class="flex gap-1 col-span-2 justify-self-end">
                    <SpaceMenu />
                </div>
            </div>
            <div class="col-start-2 col-end-9">
                <div v-if="open">
                    <SpaceItems :space-id="space.id" />
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal :header="header">
        <Form :current-form="currentForm" :space="space" />
    </Dialog>
</template>