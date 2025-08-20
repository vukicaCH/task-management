<script setup>
import Menu from 'primevue/menu';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    space:{
        type:Object,
        required: true,
    }
})

const formsStore = useFormsStore()
const spaceStore = useSpaceStore()

const openEditSpaceForm = () => {
    formsStore.toggleForm('EditSpace', 'Edit Space')
}

const openDeleteSpaceForm = () => {
    formsStore.toggleForm('DeleteSpace', 'Delete Space')
}

const menu = ref();

const items = ref([
    {
        label: 'Space',
        items: [
            {
                label: 'Edit',
                command: () => openEditSpaceForm()
            },
            {
                label: 'Delete',
                command: () => openDeleteSpaceForm()
            }
        ]
    }
]);

const toggle = (event) => {
    spaceStore.currentSpace = props.space;
    menu.value.toggle(event);
};

</script>

<template>
    <button @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"><EllipsisHorizontalIcon class="w-5 h-5" /></button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>