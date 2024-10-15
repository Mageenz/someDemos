<template>
  <div class="iframe-container" :class="{ 'landscape': isLandscape }">
    <iframe
      :src="iframeSrc"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'VideoComponent',
  data() {
    return {
      iframeSrc: 'https://learning.dcloud.io/#/?vid=0',
      isLandscape: false,
    };
  },
  mounted() {
    this.checkOrientation();
    window.addEventListener('resize', this.checkOrientation);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkOrientation);
  },
  methods: {
    checkOrientation() {
      this.isLandscape = window.innerWidth > window.innerHeight;
    },
  },
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 (9 / 16 = 0.5625) */
  position: relative;
  overflow: hidden;
}

.iframe-container.landscape {
  width: auto;
  height: 100vh;
  padding-top: 0;
  display: flex;
  justify-content: center;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.landscape iframe {
  position: static;
  width: 177.78vh; /* 16:9 宽高比 (16 / 9 = 1.7778) */
  height: 100%;
}
</style>