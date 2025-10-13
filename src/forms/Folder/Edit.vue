<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const folderName = ref(formsStore.folder.name)

const editFolder = (e) => {
    e.preventDefault()

    axiosIns
        .put(`folder/${formsStore.folder.id}`, {name: folderName.value})
        .then((res)=> {
            spaceStore.replaceFolder(res.data)
        })
        .then(() => formsStore.toggleForm())
}
</script>

<template>
    <div>
        <form @submit="(e) => editFolder(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="folderName" class="border border-white" />
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>