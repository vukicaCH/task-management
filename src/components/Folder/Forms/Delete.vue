<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore'

const props = defineProps({
    folder:{
        type:Object,
        required: true,
    }
})

const close = inject('close')

const spaceStore = useSpaceStore()

const deleteFolder = (e) => {
    e.preventDefault()

    axiosIns
        .delete(`folder/${props.folder.id}`)
        .then(()=>{
            spaceStore.removeFolder(props.folder)
            close()
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