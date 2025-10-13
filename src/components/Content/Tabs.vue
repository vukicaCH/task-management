<script setup>
import Tabs from 'primevue/tabs';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Overview from './Overview/Overview.vue';
import List from './List/List.vue';
import Board from './Board/Board.vue';
import { useViewsStore } from '@/stores/viewsStore';

const viewsStore = useViewsStore();
</script>
    
<template>
    <div>
        <Tabs v-model:value="viewsStore.currentViewTab" :lazy="true">
            <TabPanels>
                <TabPanel value="overview">
                    <Overview />
                </TabPanel>
                <TabPanel value="list">
                    <List />
                </TabPanel>
                <TabPanel value="board">
                    <Board />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>