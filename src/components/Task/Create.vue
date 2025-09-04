<script setup>
import { useSpaceStore } from '@/stores/spaceStore';
import { Select } from 'primevue';

const props = defineProps({
    listId:{
        type: String,
        required: true,
    }
})

const spaceStore = useSpaceStore();

const allListsInSpace = computed(() => {
    const spaceId = spaceStore.currentSpace?.id

    const allSpaceLists = [...spaceStore.lists.space[spaceId]]

    const allFolderLists = []
    
    spaceStore.folders[spaceId].forEach(folder => spaceStore.lists.folder[folder.id].map(list => allFolderLists.push(list)))


    return [...allSpaceLists, ...allFolderLists];
})

const createTask = (e) => {

}

</script>

<template>
    <div>
        

        <form @submit="(e) => createTask(e)">
                <Select
                    :options="allListsInSpace"
                />

                <div>
                    <button type="submit">Submit</button>
                </div>
        </form>
    </div>
</template>