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

const deleteFolder = (e) => {
    e.preventDefault()

    axiosIns
        .delete(`folder/${props.folder.id}`)
        .then(()=>{
            spaceStore.currentList = null;
            emit('close')
            spaceStore.hydrateFolders(props.folder.space.id)
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => deleteFolder(e)">

            <p class="text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this folder?
            </p>

            <div>
                <button type="submit">Confirm</button>
            </div>
        </form>
    </div>

</template>