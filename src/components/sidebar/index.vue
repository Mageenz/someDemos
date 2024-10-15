<template>
  <div class="flex justify-center">
    <div class="bg-blue-500 p-4 text-xl text-white rounded-md mr-3" v-for="route in routes" :key="route.name">
      <router-link :to="route.path">{{ route.meta.name }}</router-link>
    </div>
  </div>
</template>

<script>
import {routes} from '../../router'

export default {
  name: 'topMenu',
  data() {
    return {
      routes
    }
  }
}
</script>