<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore'
import Select from 'primevue/select';
import { FolderIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  list:{
    type: Object,
    required: true,
  },
})

const close = inject('close')

const spaceStore = useSpaceStore()

const newLocation = ref();

const options = computed(() => {
    let spaceGroups = spaceStore.spaces.map(space => ({name: space.name, id: space.id, items: spaceStore.folders[space.id]}))

    return spaceGroups
})

const deleteList = () => {
    return axiosIns.delete(`list/${props.list.id}`)
}

const createList = () => {
    const locationType = 'lists' in newLocation.value ? 'folder' : 'space'
    return axiosIns.post(`${locationType}/${newLocation.value.id}/list`, {name: props.list.name})
}

const moveList = (e) => {
    e.preventDefault()

    Promise
        .allSettled([deleteList(), createList()])
        .then((results) => {
            const movedList = results[1].value.data

            if(!movedList.folder.hidden){
                spaceStore.addListToFolder(movedList)
            }else{
                spaceStore.addListToSpace(movedList)
            }

            if(!props.list.folder.hidden){
                spaceStore.removeListFromFolder(props.list)
            }else{
                spaceStore.removeListFromSpace(props.list)
            }

            close()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => moveList(e)">

            <p class="pb-3 text-xl">Move list <i>"{{ props.list.name }}"</i> to:</p>
            
            <Select
                :options="options"
                option-label="name"
                option-group-label="name"
                option-group-children="items"
                @value-change="(val) => newLocation = val"
                placeholder="Choose new location..."
            >
                <template #value>
                    <span v-if="newLocation">
                        <span v-if="!newLocation.lists">
                            <span class="px-2 py-0.75 bg-purple-500 text-white rounded-lg">
                                {{ newLocation.name.charAt(0) }}
                            </span>
                            {{ newLocation.name }}
                        </span>
                        <span v-else class="pl-3 flex gap-1 items-center text-gray-400 hover:text-gray-200">
                            <FolderIcon class="w-5 h-5"/>
                            {{ newLocation.name }}
                        </span>
                    </span>
                </template>
                <template #optiongroup="{option}">
                    <span
                        class="cursor-pointer hover:text-white hover:font-bold"
                        @click="() => newLocation = option"
                    >
                        <span class="px-2 py-0.75 bg-purple-500 text-white rounded-lg">
                            {{ option.name.charAt(0) }}
                        </span> 
                        {{ option.name }}
                    </span>
                </template>
                <template #option="{option}">
                    <span class="pl-3 flex gap-1 items-center text-gray-400 hover:text-gray-200">
                        <FolderIcon class="w-5 h-5"/>
                        {{ option.name }}
                    </span>
                </template>
            </Select>

            <div class="pt-2">
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>