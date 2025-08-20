<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import Folders from './Folders.vue';
import Lists from './Lists.vue';
import { onMounted } from 'vue';

const props = defineProps({
    spaceId:{
        type: String,
        required: true
    }
})

const spaceStore = useSpaceStore();

const itemsLoading = computed(() => spaceStore.loading && (spaceStore.currentSpace.id === props.spaceId))

const itemsExist = computed(()=> {
    const foldersExist = props.spaceId in spaceStore.folders;
    const listsExist = props.spaceId in spaceStore.lists;

    return foldersExist && listsExist
})

onMounted(() => {
    if(!itemsExist.value){
        spaceStore.hydrateSpaceitems(props.spaceId)
    }
})

</script>

<template>
    <div v-if="!itemsLoading" class="flex flex-col gap-2">
        <Folders :space-id="spaceId" />
        <Lists :space-id="spaceId" />
    </div>
    <div v-else>
        Loading...
    </div>
</template>