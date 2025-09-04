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

const spaceName = ref(props.space.name)


const editSpace = (e) => {
    e.preventDefault()

    axiosIns
        .put(`/space/${props.space.id}`, {name: spaceName.value})
        .then(res => {
            return spaceStore.replaceSpace(res.data)
        })
        .then(()=>{
            close()
        })
}
</script>

<template>
    <div>
        <form @submit="(e) => editSpace(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="spaceName" class="border border-white" />
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>