<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';
import Select from 'primevue/select';
import { InputText } from 'primevue';

const spaceStore = useSpaceStore();
const formsStore = useFormsStore();

const selectedFolderId = ref(formsStore.folder?.id)

const listName = ref('');

const options = computed(
        () => spaceStore.spaces.map(space => ({name: space.name, id: space.id, items: spaceStore.folders[space.id]}))
)

const createList = async (e) => {
    e.preventDefault()

    if(formsStore.space){
        await axiosIns
        .post(`space/${formsStore.space.id}/list`, {name: listName.value})
        .then((res) => {
            spaceStore.addListToSpace(res.data)
        })
    }else{
        await axiosIns
        .post(`folder/${selectedFolderId.value}/list`, {name: listName.value})
        .then((res) => {
            spaceStore.addListToFolder(res.data)
        })
    }

    formsStore.toggleForm()
}
</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400 text-sm">
            All Lists are located within a Space. Lists can house any type of task.
        </p>

        <form @submit="(e) => createList(e)">
            <div class="!mt-2 flex flex-col gap-0.5">
                <span class="text-sm !font-medium">Name:</span>
                <InputText autofocus v-model="listName" />
            </div>

            <div
                v-if="formsStore.folder"
                class="!mt-2 flex flex-col gap-0.5"
            >
                <span class="text-sm !font-medium">Folder:</span>
                <Select
                    :default-value="selectedFolderId"
                    :options="options"
                    option-label="name"
                    option-group-label="name"
                    option-group-children="items"
                    option-value="id"
                    @value-change="(val) => selectedFolderId = val"
                    fluid
                />
            </div>

            <div class="flex justify-end !mt-2">
                <button
                    type="submit"
                    class="bg-gray-600 text-white px-5 py-2 rounded-md !font-medium border border-gray-600 disabled:text-gray-700 hover:text-gray-300 cursor-pointer"
                    :disabled="!listName"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>

</template>