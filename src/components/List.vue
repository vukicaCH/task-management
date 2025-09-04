<script setup>
import { ListBulletIcon } from '@heroicons/vue/24/solid';
import { useSpaceStore } from '@/stores/spaceStore';
import ListMenu from './ListMenu.vue';
import Form from './List/Forms/Form.vue';
import { Dialog } from 'primevue';

const props = defineProps({
    list:{
        type: Object,
        required: true,
    },
})

const currentForm = ref('')

const spaceStore = useSpaceStore();

const setCurrentList = () => {
    spaceStore.setCurrentList(props.list)
}

const visible = ref(false)

const openCurrentForm = (formName) => {
    currentForm.value = formName
    visible.value = true
}

const closeCurrentForm = () => visible.value = false;

provide('close', closeCurrentForm)
provide('open', openCurrentForm)

const hovered = ref(false)

</script>

<template>
    <div>
        <div class="grid grid-cols-8">
            <div
                class="grid grid-cols-8 col-span-8 row-span-1 cursor-pointer items-center relative hover:bg-gray-700 rounded-lg py-1 pr-1"
                @mouseover="hovered=true"
                @mouseleave="hovered=false"
            >
                <div class="col-span-1">
                    <div
                        class="flex items-center justify-center text-white"
                    >
                        <ListBulletIcon class="w-4 h-4"/>
                    </div>
                </div>
                <div @click="setCurrentList" class="col-span-5">
                    {{ list.name }}
                </div> 
                <div class="flex gap-1 col-span-2 justify-self-end">
                    <ListMenu/>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal :header="`${currentForm} List`">
        <Form :current-form="currentForm" :list="list" />
    </Dialog>
</template>