<template>
  <node-view-wrapper style="margin: 12px 0; display: inline" data-drag-handle>
    <el-input v-if="node.attrs.type === 'input'" style="width: 200px"></el-input>
    <el-date-picker v-else v-model="date" style="width: 200px"></el-date-picker>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { NodeViewWrapper } from "@tiptap/vue-3"

defineProps(["node"])

const date = ref(new Date())
</script>
