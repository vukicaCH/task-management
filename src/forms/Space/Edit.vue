<script setup>
import axiosIns from '@/axios'
import { useFormsStore } from '@/stores/formsStore'
import { useSpaceStore } from '@/stores/spaceStore'
import { onMounted, useTemplateRef } from 'vue'

const spaceStore = useSpaceStore()
const formsStore = useFormsStore()

const input = useTemplateRef('input')

const spaceName = ref(formsStore.space.name)

const editSpace = (e) => {
    e.preventDefault()

    axiosIns
        .put(`/space/${formsStore.space.id}`, {name: spaceName.value})
        .then(res => spaceStore.replaceSpace(res.data))
        .then(() => formsStore.toggleForm())
}

onMounted(() => input.value.focus())
</script>

<template>
    <div>
        <form @submit="(e) => editSpace(e)">
            <div class="pt-8 flex gap-2">
                <span>Name</span>
                <input v-model="spaceName" ref="input" class="border border-white" />
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>

</template>