<template>
  <div class="record-view">
    <CustomCalendar />
  </div>
</template>

<script lang="ts" setup>
import CustomCalendar from '@/components/CustomCalendar/CustomCalendar.vue'

</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.record-view {
  display: grid;
  place-items: center;
  height: 100%;

  .custom-calendar {
    padding: 40px;
  }
}
</style>
