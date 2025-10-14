<script setup>
import axios from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'
import { InputText } from 'primevue';

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()
const spaceName = ref(formsStore.space.name)

const editSpace = (e) => {
    e.preventDefault()

    axios
        .put(`/space/${formsStore.space.id}`, {name: spaceName.value})
        .then(res => spaceStore.replaceSpace(res.data))
        .then(() => formsStore.toggleForm())
}

const submitDisabled = computed(() => !spaceName.value || spaceName.value === formsStore.space.name)
</script>

<template>
    <div>
        <form @submit="(e) => editSpace(e)">
            <div class="pt-2 flex flex-col gap-1">
                <span class="text-sm !font-medium">Name:</span>
                <InputText autofocus v-model="spaceName" />
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