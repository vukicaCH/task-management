<script setup>
import axios from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'
import { InputText } from 'primevue';

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const listName = ref(formsStore.list.name)

const editList = (e) => {
    e.preventDefault()

    axios
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

const submitDisabled = computed(() => !listName.value || listName.value === formsStore.list.name)
</script>

<template>
    <div>
        <form @submit="(e) => editList(e)">
            <div class="pt-2 flex flex-col gap-1">
                <span class="text-sm !font-medium">Name:</span>
                <InputText autofocus v-model="listName" />
            </div>

            <div class="flex justify-end !mt-2">
                <button
                    type="submit"
                    class="bg-gray-600 text-white px-5 py-2 rounded-md !font-medium border border-gray-600 disabled:text-gray-700 hover:text-gray-300 cursor-pointer"
                    :disabled="submitDisabled"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>

</template>