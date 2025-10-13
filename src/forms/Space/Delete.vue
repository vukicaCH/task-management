<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const formsStore = useFormsStore()

const spaceStore = useSpaceStore()

const deleteSpace = (e) => {
    e.preventDefault()

    axiosIns
        .delete(`/space/${formsStore.space.id}`)
        .then(()=>{
            spaceStore.removeSpace(formsStore.space.id)
            formsStore.toggleForm()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => deleteSpace(e)">

            <p class="text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this space (<span class="!font-medium">{{formsStore.space.name.toUpperCase() }})</span>?
            </p>

            <div>
                <button type="submit">Confirm</button>
            </div>
        </form>
    </div>

</template>