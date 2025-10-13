<script setup>
import { InputText } from 'primevue';
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore';
import { useFormsStore } from '@/stores/formsStore';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore();

const spaceName = ref('')

const createSpace = (e) => {
    e.preventDefault()

    axiosIns
        .post('/team/90151303803/space', {name: spaceName.value})
        .then((res)=>{
            spaceStore.addSpace(res.data)
            formsStore.toggleForm()
        })
}
</script>

<template>
    <div v-if="spaceStore.spaces.length < 5">
        <p class="text-surface-500 dark:text-surface-400 text-sm">
            A Space represents teams, departments, or groups, each with its own Lists, workflows, and settings.
        </p>

        <form @submit="(e) => createSpace(e)">
            <div class="pt-8 flex flex-col gap-1">
                <span class="text-sm !font-medium">Name:</span>
                <InputText autofocus v-model="spaceName" />
            </div>

            <div class="flex justify-end !mt-2">
                <button
                    type="submit"
                    class="bg-gray-600 text-white px-5 py-2 rounded-md !font-medium border border-gray-600 disabled:text-gray-700 hover:text-gray-300 cursor-pointer"
                    :disabled="!spaceName"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>
    <div v-else>Maximum amount of spaces reached for free plan.</div>
</template>