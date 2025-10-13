<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const deleteList = (e) => {
    e.preventDefault()

    axiosIns
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
                Are you sure you want to delete this list?
            </p>

            <div>
                <button type="submit">Confirm</button>
            </div>
        </form>
    </div>

</template>