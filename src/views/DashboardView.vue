<template>
  <div class="dashboard-view" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DashboardView',
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/colors" as colors;

.dashboard-view {
  display: flex;
  gap: 20px;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-blend-mode: screen;
  height: 100vh;
  overflow: hidden;

  .box {
    background-color: map.get($map: colors.$blue, $key: "200");
    width: 100px;
    height: 100px;
  }
}
</style>
