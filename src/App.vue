<script setup lang="ts">
import { VThemeProvider, VContainer } from 'vuetify/components'
</script>

<template>
  <v-theme-provider theme="dark" with-background>
    <v-container>
      <RouterView />
    </v-container>
  </v-theme-provider>
</template>
