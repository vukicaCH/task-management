<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore'

const props = defineProps({
    folder:{
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close'])

const spaceStore = useSpaceStore()

const folderName = ref(props.folder.name)

const editFolder = (e) => {
    e.preventDefault()

    axiosIns
        .put(`folder/${props.folder.id}`, {name: folderName.value})
        .then(()=>{
            emit('close')
            spaceStore.hydrateFolders(props.folder.space.id)
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => editFolder(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="folderName" class="border border-white" />
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>