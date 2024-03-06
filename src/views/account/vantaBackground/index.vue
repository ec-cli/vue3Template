<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description:
 * @Date: 2023-10-19 12:27:52
 * @LastEditors: tuoyouxin@fpwis.com
 * @LastEditTime: 2023-10-20 09:11:12
-->
<template>
  <div ref="vantaRef" class="vanta-container"></div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import * as THREE from 'three'
import GLOBE from 'vanta/src/vanta.globe'
const vantaRef = ref(null)

let vantaEffect = null

onMounted(() => {
  vantaEffect = GLOBE({
    el: vantaRef.value,
    THREE: THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x3fddff,
    color2: 0xd1ff,
    size: 0.8,
    backgroundColor: 0x333778
  })
})

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})
</script>
<style lang="scss" scoped>
.vanta-container {
  width: 100vw;
  height: 100vh;
  background: #191b3c;
}
</style>
