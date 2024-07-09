<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWSPRStore } from '@/stores/wspr'

import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Chip from 'primevue/chip'
import ToggleButton from 'primevue/togglebutton'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const tracking = ref(false)
const callsign = ref()

const wsprStore = useWSPRStore()

const { currentTracking, uiOptions } = storeToRefs(wsprStore)
const { track, stopTracking, STATE } = wsprStore

console.log(STATE.IDLE)

const STATE_TEXT = {}
STATE_TEXT[STATE.IDLE] = 'Idle'
STATE_TEXT[STATE.DOWNLOADING] = 'Downloading data'
STATE_TEXT[STATE.REFRESHING] = 'Waiting for refresh'
STATE_TEXT[STATE.ERROR] = 'Error'

defineProps({
  msg: {
    type: String,
    required: true
  }
})

const buttonLabel = computed(() => {
  if (tracking.value) {
    return 'Stop tracking'
  }
  return 'Track'
})

function onTrack() {
  if (!callsign.value) return

  tracking.value = !tracking.value

  if (tracking.value) {
    track(callsign.value)
  } else {
    stopTracking()
  }
}
</script>

<template>
  <div>
    <div class="title">{{ msg }}</div>
    <div class="subtitle pl pb">Search for a callsign to begin tracking</div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; column-gap: 2em">
      <div style="display: grid; grid-template-rows: 1fr 1fr; row-gap: 1em">
        <InputGroup>
          <InputText
            v-model="callsign"
            placeholder="Enter callsign"
            :disabled="tracking"
            @input="callsign = callsign.toUpperCase()"
            @keydown.enter="onTrack"
          />
          <Button
            type="button"
            :label="buttonLabel"
            icon="pi pi-search"
            :loading="tracking"
            :disabled="false"
            @click="onTrack"
          />
        </InputGroup>
        <div>
          <ToggleButton v-model="uiOptions.showGrid" onLabel="Hide Grid" offLabel="Show Grid" />
        </div>
      </div>
      <div>
        <Chip :label="`State: ${STATE_TEXT[currentTracking.state] ?? 'Unknown'}`" />
        <Chip class="ml" v-if="currentTracking.error" :label="`${currentTracking.error}`" />
        <Chip
          class="ml"
          v-if="currentTracking.state == STATE.REFRESHING"
          :label="`${currentTracking.rowsReceived} entries received`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-weight: 300;
  font-size: 2rem;
}

.subtitle {
  font-size: 0.8rem;
  font-weight: 300;
}

.pl {
  padding-left: 1rem;
}
.pb {
  padding-bottom: 1rem;
}
.ml {
  margin-left: 1em;
}
</style>
