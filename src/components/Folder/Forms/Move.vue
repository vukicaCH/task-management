<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore'
import Select from 'primevue/select';

const props = defineProps({
    folder:{
        type:Object,
        required: true,
    }
})

const close = inject('close')

const spaceStore = useSpaceStore()

const newSpaceLocationId = ref();

const deleteFolder = () => {
    return axiosIns
        .delete(`folder/${props.folder.id}`)
}

const createFolder = async () => {
    return axiosIns
        .post(`space/${newSpaceLocationId.value}/folder`, {name: props.folder.name})
}

const moveList = (e) => {
    e.preventDefault()

    let movedFolder = {};

    Promise
        .allSettled([deleteFolder(), createFolder()])
        .then(results => {
            movedFolder = results[1].value.data

            const createListPromises = []

            props.folder.lists.forEach(list => {
                createListPromises.push(axiosIns.post(`folder/${movedFolder.id}/list`, {name: list.name}))
            })

            return Promise.allSettled(createListPromises)
        })
        .then((createdLists) => {
            spaceStore.addFolder(movedFolder)
            spaceStore.removeFolder(props.folder)
            createdLists.map(createdList => spaceStore.addListToFolder(createdList.value.data))
            close()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => moveList(e)">

            <p class="pb-3 text-xl">Move Folder <i>"{{ folder.name }}"</i> to:</p>
            
            <Select
                v-model="newSpaceLocationId"
                :options="spaceStore.spaces"
                option-label="name"
                option-value="id"
                placeholder="Choose new location..."
            >
                <template #option="{option}">
                    <div
                        class="cursor-pointer hover:text-white hover:font-bold flex items-center gap-2"
                    >
                        <div class="w-6 h-6 flex justify-center items-center bg-purple-500 text-white text-sm rounded-lg">
                            <span class="font-extrablack">{{ option.name.charAt(0) }}</span>
                        </div> 
                        {{ option.name }}
                    </div>
                </template>
            </Select>

            <div class="pt-2">
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>