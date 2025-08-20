<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore();
const formsStore = useFormsStore();

const folderName = ref('')

const createFolder = (e) => {
    e.preventDefault()

    const spaceId = spaceStore.currentSpace.id

    axiosIns
        .post(`space/${spaceId}/folder`, {name: folderName.value})
        .then((res)=>{
            spaceStore.folders[spaceId].push(res.data)
            formsStore.toggleForm()
        })
}
</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400">
            Use Folders to organize your Lists, Docs, and more.
        </p>

        <form @submit="(e) => createFolder(e)">
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