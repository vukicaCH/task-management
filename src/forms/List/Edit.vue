<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const listName = ref(formsStore.list.name)

const editList = (e) => {
    e.preventDefault()

    axiosIns
        .put(`list/${formsStore.list.id}`, {name: listName.value})
        .then(async (res) => {
            const {space, folder} = res.data;

            spaceStore.currentList = res.data

            if(folder.hidden){
                return spaceStore.hydrateLists(space.id)
            }else{
                return spaceStore.hydrateFolderLists(folder.id)
            }
        })
        .then(() => formsStore.toggleForm())
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