<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const deleteSpace = (e) => {
    e.preventDefault()

    axiosIns
        .delete(`/space/${spaceStore.currentSpace.id}`)
        .then(()=>{
            formsStore.toggleForm()
            spaceStore.hydrateSpaces()
            spaceStore.currentSpace = null;
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => deleteSpace(e)">

            <p class="text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this space?
            </p>

            <div>
                <button type="submit">Confirm</button>
            </div>
        </form>
    </div>

</template>