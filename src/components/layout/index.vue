<template>
  <div class="layout">
    <sidebar />
  </div>
</template>

<script>
import sidebar from '../sidebar'

export default {
  name: 'layout',
  components: {
    sidebar
  }
}
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
</style>