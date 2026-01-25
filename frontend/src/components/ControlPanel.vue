<template>
  <div class="control-panel">
    <!-- 边框设置 -->
    <div class="control-section">
      <div class="control-header">
        <input type="checkbox" v-model="border.enabled" class="control-checkbox" />
        <h3 class="control-title">边框</h3>
      </div>

      <div v-if="border.enabled" class="control-body">
        <div class="control-item">
          <label class="control-label">颜色</label>

          <!-- 图片颜色建议 -->
          <div v-if="suggestedColors.length > 0" class="color-suggestions">
            <div
              v-for="color in suggestedColors"
              :key="color"
              @click="$emit('apply-border-color', color)"
              :class="['color-suggestion', { active: border.color === color }]"
              :style="{ backgroundColor: color }"
              :title="color"
            >
              <span class="color-suggestion-value">{{ color }}</span>
            </div>
          </div>

          <div class="color-picker">
            <input
              type="color"
              v-model="border.color"
              class="color-input"
            />
            <span class="color-value">{{ border.color }}</span>
          </div>
        </div>

        <div class="control-item">
          <label class="control-label">宽度: {{ border.width }}px</label>
          <input
            type="range"
            v-model.number="border.width"
            min="0"
            max="100"
            class="control-slider"
          />
        </div>

        <div class="control-item">
          <label class="control-label">样式</label>
          <select v-model="border.style" class="control-select">
            <option value="solid">实线</option>
            <option value="dashed">虚线</option>
            <option value="double">双线</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 圆角设置 -->
    <div class="control-section">
      <div class="control-header">
        <input type="checkbox" v-model="corner.enabled" class="control-checkbox" />
        <h3 class="control-title">圆角</h3>
      </div>

      <div v-if="corner.enabled" class="control-body">
        <div class="control-item">
          <label class="control-label">半径: {{ corner.radius }}px</label>
          <input
            type="range"
            v-model.number="corner.radius"
            min="0"
            max="100"
            class="control-slider"
          />
        </div>
      </div>
    </div>

    <!-- 阴影设置 -->
    <div class="control-section">
      <div class="control-header">
        <input type="checkbox" v-model="shadow.enabled" class="control-checkbox" />
        <h3 class="control-title">阴影</h3>
      </div>

      <div v-if="shadow.enabled" class="control-body">
        <div class="control-item">
          <label class="control-label">模糊: {{ shadow.blur }}px</label>
          <input
            type="range"
            v-model.number="shadow.blur"
            min="0"
            max="50"
            class="control-slider"
          />
        </div>

        <div class="control-item">
          <label class="control-label">X 偏移: {{ shadow.offsetX }}px</label>
          <input
            type="range"
            v-model.number="shadow.offsetX"
            min="-50"
            max="50"
            class="control-slider"
          />
        </div>

        <div class="control-item">
          <label class="control-label">Y 偏移: {{ shadow.offsetY }}px</label>
          <input
            type="range"
            v-model.number="shadow.offsetY"
            min="-50"
            max="50"
            class="control-slider"
          />
        </div>

        <div class="control-item">
          <label class="control-label">颜色</label>

          <!-- 图片颜色建议 -->
          <div v-if="suggestedColors.length > 0" class="color-suggestions">
            <div
              v-for="color in suggestedColors"
              :key="color"
              @click="$emit('apply-shadow-color', color)"
              :class="['color-suggestion', { active: hexShadowColor === color }]"
              :style="{ backgroundColor: color }"
              :title="color"
            >
              <span class="color-suggestion-value">{{ color }}</span>
            </div>
          </div>

          <div class="color-picker">
            <input
              type="color"
              :value="hexShadowColor"
              @input="shadow.color = rgbaToHex($event.target.value, shadowAlpha)"
              class="color-input"
            />
            <input
              type="range"
              v-model.number="shadowAlpha"
              min="0"
              max="1"
              step="0.1"
              class="control-slider opacity-slider"
            />
            <span class="color-value">{{ Math.round(shadowAlpha * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 导出设置 -->
    <div class="control-section">
      <h3 class="control-title">导出</h3>
      <div class="control-body">
        <div class="control-item">
          <label class="control-label">格式</label>
          <div class="format-buttons">
            <button
              v-for="fmt in ['png', 'jpg', 'webp']"
              :key="fmt"
              @click="exportSettings.format = fmt"
              :class="['format-btn', { active: exportSettings.format === fmt }]"
            >
              {{ fmt.toUpperCase() }}
            </button>
          </div>
        </div>

        <div v-if="exportSettings.format !== 'png'" class="control-item">
          <label class="control-label">质量: {{ exportSettings.quality }}%</label>
          <input
            type="range"
            v-model.number="exportSettings.quality"
            min="10"
            max="100"
            class="control-slider"
          />
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="control-actions">
      <button @click="$emit('reset')" class="btn btn-secondary">
        重置
      </button>
      <button
        @click="$emit('export')"
        :disabled="!imageData"
        class="btn btn-primary"
      >
        导出图片
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  border: Object,
  shadow: Object,
  corner: Object,
  exportSettings: Object,
  imageData: String,
  suggestedColors: {
    type: Array,
    default: () => []
  },
});

const emit = defineEmits(['export', 'reset', 'apply-border-color', 'apply-shadow-color']);

// 阴影透明度（从 rgba 中提取）
const shadowAlpha = ref(0.3);

// 监听阴影颜色变化，同步更新透明度
watch(() => props.shadow.color, (val) => {
  const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match && match[4]) {
    shadowAlpha.value = parseFloat(match[4]);
  }
}, { immediate: true });

// 阴影颜色的 hex 值（用于颜色选择器）
const hexShadowColor = computed(() => {
  const match = props.shadow.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const toHex = (n) => parseInt(n).toString(16).padStart(2, '0');
    return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
  }
  return '#000000';
});

// 将 hex 转换为 rgba
function rgbaToHex(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 监听透明度变化，更新阴影颜色
watch(shadowAlpha, (val) => {
  const match = props.shadow.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    emit('update:shadow', {
      ...props.shadow,
      color: `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${val})`,
    });
  }
});
</script>

<style scoped>
.control-panel {
  @apply flex flex-col h-full overflow-y-auto;
}

.control-section {
  @apply border-b border-gray-200;
}

.control-header {
  @apply flex items-center gap-2 px-4 py-3 bg-gray-50;
}

.control-checkbox {
  @apply w-4 h-4 text-primary-600 rounded focus:ring-primary-500;
}

.control-title {
  @apply text-sm font-medium text-gray-700;
}

.control-body {
  @apply px-4 py-3 space-y-4;
}

.control-item {
  @apply space-y-2;
}

.control-label {
  @apply block text-sm font-medium text-gray-600;
}

.control-slider {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

.control-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-primary-600 rounded-full cursor-pointer;
}

.control-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
}

.color-picker {
  @apply flex items-center gap-2;
}

.color-input {
  @apply w-10 h-10 rounded cursor-pointer border-0 p-0;
}

.color-value {
  @apply text-sm text-gray-600 font-mono;
}

/* 颜色建议 */
.color-suggestions {
  @apply flex flex-wrap gap-2 mb-3;
}

.color-suggestion {
  @apply relative h-12 flex-1 min-w-16 rounded cursor-pointer transition-all hover:scale-105;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-suggestion.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.color-suggestion-value {
  @apply text-xs font-mono px-1 py-0.5 rounded bg-white bg-opacity-90;
  color: #1f2937;
  font-weight: 500;
}

.opacity-slider {
  @apply flex-1;
}

.format-buttons {
  @apply flex gap-2;
}

.format-btn {
  @apply flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors;
}

.format-btn.active {
  @apply bg-primary-600 text-white border-primary-600 hover:bg-primary-700;
}

.control-actions {
  @apply flex gap-2 p-4 bg-gray-50 sticky bottom-0;
}

.btn {
  @apply flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>
