<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useWSPRStore } from '@/stores/wspr'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup' // optional
import Row from 'primevue/row'

const wsprStore = useWSPRStore()

const { currentTracking, data } = storeToRefs(wsprStore)
</script>
<template>
  <div class="card">
    <DataTable :value="data" stripedRows paginator :rows="5" tableStyle="min-width: 50rem">
      <Column field="date" sortable header="Date"></Column>
      <Column field="maidenhead" header="Maidenhead"></Column>
      <Column field="lat" header="Latitude"></Column>
      <Column field="lon" header="Longitude"></Column>
    </DataTable>
  </div>
</template>
<style scoped></style>
