<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    folderless:{
        type: Boolean,
        required: false
    }
})

const emit = defineEmits(['close'])

const spaceStore = useSpaceStore();
const formsStore = useFormsStore();

const listName = ref('')

const createList = (e) => {
    e.preventDefault()

    axiosIns
        .post(`space/${spaceStore.currentSpace.id}/list`, {name: listName.value})
        .then((res) => {
            spaceStore.addListToSpace(res.data)
            formsStore.toggleForm()
        })
}
</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400">
            All Lists are located within a Space. Lists can house any type of task.
        </p>

        <form @submit="(e) => createList(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="listName" class="border border-white" />
            </div>

            

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>