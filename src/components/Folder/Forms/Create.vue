<script setup>
import axiosIns from '@/axios'
import { useSpaceStore } from '@/stores/spaceStore';

const props = defineProps({
    space:{
        type: Object,
        required: true,
    }
})

const close = inject('close');

const spaceStore = useSpaceStore();

const folderName = ref('')

const createFolder = (e) => {
    e.preventDefault()

    axiosIns
        .post(`space/${props.space.id}/folder`, {name: folderName.value})
        .then((res)=>{
            spaceStore.addFolder(res.data)
            close()
        })
}
</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400">
            Use Folders to organize your Lists, Docs, and more.
        </p>

        <form @submit="(e) => createFolder(e)">
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