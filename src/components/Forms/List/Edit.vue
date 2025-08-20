<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const emit = defineEmits(['close'])

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const listName = ref(spaceStore.currentList.name)

const editList = (e) => {
    e.preventDefault()

    axiosIns
        .put(`list/${spaceStore.currentList.id}`, {name: listName.value})
        .then((res) => {
            const {space, folder} = res.data;

            if(folder.hidden){
                return spaceStore.hydrateFolderlessLists(space.id)
            }else{
                return spaceStore.hydrateFolderLists(folder.id)
            }
        })
        .then(()=> formsStore.toggleForm())
}
</script>

<template>
    <div>
        <form @submit="(e) => editList(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="listName" class="border border-white" />
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>