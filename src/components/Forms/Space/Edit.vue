<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const spaceName = ref(spaceStore.currentSpace.name)


const editSpace = (e) => {
    e.preventDefault()

    axiosIns
        .put(`/space/${spaceStore.currentSpace.id}`, {name: spaceName.value})
        .then(()=>{
            formsStore.toggleForm()
            spaceStore.hydrateSpaces()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => editSpace(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="spaceName" class="border border-white" />
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>