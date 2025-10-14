<script setup>
import axios from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'
import { InputText } from 'primevue';

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const folderName = ref(formsStore.folder.name)

const editFolder = (e) => {
    e.preventDefault()

    axios
        .put(`folder/${formsStore.folder.id}`, {name: folderName.value})
        .then((res)=> {
            spaceStore.replaceFolder(res.data)
        })
        .then(() => formsStore.toggleForm())
}

const submitDisabled = computed(() => !folderName.value || folderName.value === formsStore.folder.name)
</script>

<template>
    <div>
        <form @submit="(e) => editFolder(e)">
            <div class="pt-2 flex flex-col gap-1">
                <span class="text-sm !font-medium">Name:</span>
                <InputText autofocus v-model="folderName" />
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