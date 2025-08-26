<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <UButton
    color="neutral"
    icon="i-simple-icons-github"
    size="xl"
    target="_blank"
    :to="appConfig.social?.githubOrgUrl"
    variant="subtle"
  >
    Repositories
  </UButton>
</template>
