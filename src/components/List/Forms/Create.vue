<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore';
import Select from 'primevue/select';

const props = defineProps({
    folder:{
        type: Object,
        required:false,
    },

    space:{
        type: Object,
        required: false
    }
})

const spaceStore = useSpaceStore();

const close = inject('close')

const selectedFolderId = ref(props.folder?.id)

const listName = ref('');

const options = computed(() => spaceStore.spaces.map(space => ({name: space.name, id: space.id, items: spaceStore.folders[space.id]})))

const createList = async (e) => {
    e.preventDefault()

    if(props.space){
        await axiosIns
        .post(`space/${props.space.id}/list`, {name: listName.value})
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

    close()
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

                <div v-if="folder">
                    <Select
                        :default-value="selectedFolderId"
                        :options="options"
                        option-label="name"
                        option-group-label="name"
                        option-group-children="items"
                        option-value="id"
                        @value-change="(val) => selectedFolderId = val"
                    />
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
        </form>
    </div>

</template>