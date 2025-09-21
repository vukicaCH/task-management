<script setup>
import { useFormsStore } from '@/stores/formsStore';
import { useSpaceStore } from '@/stores/spaceStore';
import Tag from '../Tags/Tag.vue';
import Popover from 'primevue/popover';
import TagEditor from '../Tags/TagEditor.vue';
import axiosIns from '@/axios';
import _ from 'lodash';
import InputText from 'primevue/inputtext';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';
import { useTasksStore } from '@/stores/tasksStore';
import { watchEffect } from 'vue';

const formsStore = useFormsStore()
const spaceStore = useSpaceStore()
const tasksStore = useTasksStore()

const taskSpaceId = formsStore.task.space.id;

const searchQuery = ref('');

const tags = ref([]);

watchEffect(()=> {
    const tagsNames = formsStore.task.tags.map(tag => tag.name);

    tags.value = spaceStore.tags[formsStore.task.space.id].filter(tag => tagsNames.includes(tag.name))
})

const tagOptions = computed(() => {
    const tagNames = tags.value.map(tag => tag.name)
    return spaceStore.tags[taskSpaceId]?.filter(tag => !tagNames.includes(tag.name) && tag.name.includes(searchQuery.value))
})

tasksStore.$onAction(
  ({
    name,
    args,
    after,
  }) => {

    if(['attachTag','removeTag'].includes(name)){
        after(() => {
            const usedTag = args[1];

            if(name === 'removeTag') tags.value = tags.value.filter(tag => tag.name !== usedTag.name);
            else tags.value = [usedTag, ...tags.value]
        })
    }
  }
)

const loading = ref(false);

const popover = ref();

function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const createSpaceTag = () => {
    const spaceId = spaceStore.currentSpace.id;

    const color = getRandomHexColor()

    const tagToBeCreated = {name: searchQuery.value, tag_bg: color, tag_fg: color}

    axiosIns
        .post(`space/${spaceId}/tag`, {tag: tagToBeCreated})
        .then(() => spaceStore.hydrateSpaceTags(spaceId))
        .then(() => tasksStore.attachTag(formsStore.task.id, tagToBeCreated))
        .finally(() => searchQuery.value = '')

}

const togglePopover = (event, tag) => {
    event.stopPropagation();
    formsStore.tag = tag;
    popover.value.toggle(event);
}

const editSpaceTag = (data) => {
    const tagName = formsStore.tag.name
    const spaceId = spaceStore.currentSpace.id;
    const params = JSON.stringify({tag: data})
    
    axiosIns
        .put(`space/${spaceId}/tag/${tagName}`, params)
        .then(() => spaceStore.hydrateSpaceTags(spaceId))
}

const deleteSpaceTag = () => {
    popover.value.hide()

    const tagName = formsStore.tag.name;
    const spaceId = spaceStore.currentSpace.id;

    spaceStore.deleteSpaceTag(spaceId, tagName)
}

const addTagToTask = (tag) => {
    searchQuery.value = ''
    tasksStore.attachTag(formsStore.task.id, tag)
}

provide('open-tag-editor', togglePopover)

onMounted(() => console.log(formsStore.task.tags))
</script>

<template>
    <div>
        <p class="text-surface-500 dark:text-surface-400 !mb-3">
            Tags for <i>"{{ formsStore.task.name }}"</i>:
        </p>

        <div class="gap-2 grid grid-cols-2 !mb-2">
            <Tag v-for="tag in tags" :tag="tag" include-menu />
        </div>

        <div v-if="!loading && tagOptions">
            <div class="rounded-md border ">
                <InputText v-model="searchQuery" placeholder="Search or add tags..." />
                    <div v-if="tagOptions.length">
                        <div
                            v-for="tag in tagOptions"
                            class="flex items-center justify-between w-full p-2 !my-2 hover:bg-gray-800"
                            @click="addTagToTask(tag)"
                        >
                            <div>
                                <Tag :tag="tag" />
                            </div>
                            <div>
                                <button @click="(e) => togglePopover(e, tag)">
                                    <EllipsisHorizontalIcon class="w-5 h-5 hover:text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="searchQuery && !tagOptions.length" @click="createSpaceTag" class="flex items-center gap-2 hover:bg-gray-700 p-2 !my-2 cursor-pointer">
                        <i>Create</i>
                        <div class="rounded-md bg-blue-500 text-xs py-1 px-2 flex items-center">{{ searchQuery }}</div>
                    </div>
            </div>
        </div>
        <div v-else>
            loading...
        </div>
    </div>

    <Popover ref="popover">
        <TagEditor
            @delete="deleteSpaceTag"
            @edit="(tagData) => editSpaceTag(tagData)"
        />
    </Popover>
</template>