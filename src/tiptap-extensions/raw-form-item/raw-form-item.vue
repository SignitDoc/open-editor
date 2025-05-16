<template>
  <node-view-wrapper style="display: inline">
    <span v-if="node.attrs.type === 'radio-group'">
      <span v-for="option in node.attrs.options" :key="option.value">
        <input type="radio" :id="option.value" />
        <label :for="option.value">{{ option.label }}</label>
      </span>
    </span>
    <span v-else-if="node.attrs.type === 'select'">
      <select style="width: 80px">
        <option v-for="option in node.attrs.options" :value="option.value" :key="option.value">
          {{ option.label }}
        </option>
      </select>
    </span>
    <input v-else :type="node.attrs.type" />
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper } from "@tiptap/vue-3"

defineProps<{ node: any }>()
</script>
