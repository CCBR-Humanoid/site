<!-- Component containing the muted copyright text on the left side of the foote -->
<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <p
    v-if="footer?.credits"
    class="text-muted text-sm"
  >
    {{ footer.credits }}
  </p>
</template>
