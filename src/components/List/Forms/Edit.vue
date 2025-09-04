<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore'

const props = defineProps({
  list:{
    type: Object,
    required: true,
  },
})

const close = inject('close')

const spaceStore = useSpaceStore()

const listName = ref(props.list.name)

const editList = (e) => {
    e.preventDefault()

    axiosIns
        .put(`list/${props.list.id}`, {name: listName.value})
        .then(async (res) => {
            const {space, folder} = res.data;

            spaceStore.currentList = res.data

            if(folder.hidden){
                return spaceStore.hydrateLists(space.id)
            }else{
                return spaceStore.hydrateFolderLists(folder.id)
            }
        })
        .then(() => close())
}
</script>

<template>
    <div>
        <form @submit="(e) => editList(e)">
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