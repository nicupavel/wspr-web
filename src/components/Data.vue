<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useWSPRStore } from '@/stores/wspr'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const wsprStore = useWSPRStore()

const { data, uiOptions } = storeToRefs(wsprStore)
const localData = ref(data)

watch(
  () => uiOptions.value,
  (options) => {
    if (options.dateFilter == null) {
      // Date Filter reset show entire data available
      localData.value = data.value
    } else if (options.dateFilter[1]) {
      // Both Dates filled in filter show filtered data
      localData.value = data.value.filter(
        (e) =>
          new Date(e.date) >= options.dateFilter[0] && new Date(e.date) <= options.dateFilter[1]
      )
    }
  },
  { deep: true }
)
</script>
<template>
  <div class="card">
    <DataTable :value="localData" stripedRows paginator :rows="5" tableStyle="min-width: 50rem">
      <Column field="date" sortable header="Date"></Column>
      <Column field="maidenhead" header="Maidenhead"></Column>
      <Column field="lat" header="Latitude">
        <template #body="{ data }">
          {{ data.lat?.toFixed(5) }}
        </template>
      </Column>
      <Column field="lon" header="Longitude">
        <template #body="{ data }">
          {{ data.lon?.toFixed(5) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<style scoped></style>
