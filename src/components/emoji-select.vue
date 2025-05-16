<!-- 表情选择 -->
<template>
  <div class="emoji-select-container">
    <el-popover ref="EmojiRef" placement="top" :width="310" trigger="click">
      <div class="emoji-list">
        <div v-for="item in emojiList" :key="item.hexcode" class="emoji-item" @click="setEmoji(item)">
          {{ item.emoji }}
        </div>
      </div>
      <template #reference>
        <i class="ri-user-smile-line"></i>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import emojis from "emojibase-data/zh/data.json"

const EmojiRef = ref()
const emojiList = ref<Array<any>>([])

onMounted(() => {
  // 去掉字母和国旗
  emojiList.value = emojis.filter(item => item.group === 0 || (item.group && item.group !== 9))
})

const emits = defineEmits(["addEmoji"])
function setEmoji(emoji) {
  emits("addEmoji", emoji)
  EmojiRef.value?.hide()
}
</script>

<style lang="less" scoped>
.emoji-list {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  .emoji-item {
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
