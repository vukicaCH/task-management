<script setup>
import { InputText } from 'primevue';
import axios from '@/axios'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore()

const folderName = ref('')

const createFolder = (e) => {
    e.preventDefault()

    axios
        .post(`space/${formsStore.space.id}/folder`, {name: folderName.value})
        .then((res)=>{
            spaceStore.addFolder(res.data)
            formsStore.toggleForm()
        })
}
</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400 text-sm">
            Use Folders to organize your Lists, Docs, and more.
        </p>

        <form @submit="(e) => createFolder(e)">
            <div class="pt-8 flex flex-col gap-1">
                <span class="text-sm !font-medium">Name:</span>
                <InputText autofocus v-model="folderName" />
            </div>

            <div class="flex justify-end !mt-2">
                <button
                    type="submit"
                    class="bg-gray-600 text-white px-5 py-2 rounded-md !font-medium border border-gray-600 disabled:text-gray-700 hover:text-gray-300 cursor-pointer"
                    :disabled="!folderName"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>

</template>