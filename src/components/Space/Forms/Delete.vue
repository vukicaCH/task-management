<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore'

const props = defineProps({
    space: {
        type: Object,
        required: true,
    }
})

const close = inject('close')

const spaceStore = useSpaceStore()

const deleteSpace = (e) => {
    e.preventDefault()

    axiosIns
        .delete(`/space/${props.space.id}`)
        .then(()=>{
            spaceStore.removeSpace(props.space.id)
            close()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => deleteSpace(e)">

            <p class="text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this space?
            </p>

            <div>
                <button type="submit">Confirm</button>
            </div>
        </form>
    </div>

</template>