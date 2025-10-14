<script setup>
import axios from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const deleteList = (e) => {
    e.preventDefault()

    axios
        .delete(`list/${formsStore.list.id}`)
        .then(()=> {
            if(!formsStore.list.folder.hidden){
                spaceStore.removeListFromFolder(formsStore.list)
            }else{
                spaceStore.removeListFromSpace(formsStore.list)
            }

            formsStore.toggleForm()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => deleteList(e)">
            <p class="text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this list (<span class="!font-medium">{{formsStore.list.name.toUpperCase() }})</span>?
            </p>

            <div class="flex justify-end !mt-2">
                <button
                    type="submit"
                    class="bg-gray-600 text-white px-5 py-2 rounded-md !font-medium border border-gray-600 hover:text-gray-300 cursor-pointer"
                >
                    Confirm
                </button>
            </div>
        </form>
    </div>

</template>