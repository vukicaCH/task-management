<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore'

const spaceStore = useSpaceStore()

const deleteList = (e) => {
    e.preventDefault()

    axiosIns
        .delete(`list/${props.list.id}`)
        .then(()=> {
            folderless ? spaceStore.removeListFromSpace(props.list) : spaceStore.removeListFromFolder(props.list)
        })
        .then(()=>{
            emit('close')
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => deleteList(e)">

            <p class="text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this list?
            </p>

            <div>
                <button type="submit">Confirm</button>
            </div>
        </form>
    </div>

</template>