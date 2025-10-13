<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const deleteFolder = (e) => {
    e.preventDefault()

    axiosIns
        .delete(`folder/${formsStore.folder.id}`)
        .then(()=>{
            spaceStore.removeFolder(formsStore.folder)
            formsStore.toggleForm()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => deleteFolder(e)">

            <p class="text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this folder?
            </p>

            <div>
                <button type="submit">Confirm</button>
            </div>
        </form>
    </div>

</template>