<template>
  <div class="control-panel">
    <!-- 边框设置 -->
    <div class="control-group">
      <div class="control-group-header" @click="border.enabled = !border.enabled">
        <div class="control-header-left">
          <div class="toggle-switch">
            <input type="checkbox" v-model="border.enabled" class="toggle-input" />
            <span class="toggle-slider"></span>
          </div>
          <div class="control-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 class="control-title">边框效果</h3>
        </div>
        <svg :class="['chevron', { expanded: border.enabled }]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <Transition name="slide">
        <div v-if="border.enabled" class="control-group-body">
          <!-- 颜色选择 -->
          <div class="control-item">
            <label class="item-label">边框颜色</label>

            <!-- 颜色建议 -->
            <div v-if="suggestedColors.length > 0" class="color-palette">
              <div
                v-for="color in suggestedColors"
                :key="color"
                @click="$emit('apply-border-color', color)"
                :class="['color-chip', { active: border.color === color }]"
                :style="{ backgroundColor: color }"
                :title="color"
              />
            </div>

            <div class="color-row">
              <div class="color-picker-wrapper">
                <input type="color" v-model="border.color" class="color-picker-input" />
                <div class="color-preview" :style="{ backgroundColor: border.color }"></div>
              </div>
              <span class="color-hex">{{ border.color }}</span>
            </div>
          </div>

          <!-- 宽度滑块 -->
          <div class="control-item">
            <div class="slider-header">
              <label class="item-label">边框宽度</label>
              <span class="slider-value">{{ border.width }}px</span>
            </div>
            <input
              type="range"
              v-model.number="border.width"
              min="0"
              max="100"
              class="custom-slider"
            />
          </div>

          <!-- 样式选择 -->
          <div class="control-item">
            <label class="item-label">边框样式</label>
            <div class="style-options">
              <button
                v-for="style in borderStyles"
                :key="style.value"
                @click="border.style = style.value"
                :class="['style-option', { active: border.style === style.value }]"
              >
                <span class="style-preview" :class="`style-preview--${style.value}`"></span>
                {{ style.label }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 圆角设置 -->
    <div class="control-group">
      <div class="control-group-header" @click="corner.enabled = !corner.enabled">
        <div class="control-header-left">
          <div class="toggle-switch">
            <input type="checkbox" v-model="corner.enabled" class="toggle-input" />
            <span class="toggle-slider"></span>
          </div>
          <div class="control-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
            </svg>
          </div>
          <h3 class="control-title">圆角效果</h3>
        </div>
        <svg :class="['chevron', { expanded: corner.enabled }]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <Transition name="slide">
        <div v-if="corner.enabled" class="control-group-body">
          <div class="control-item">
            <div class="slider-header">
              <label class="item-label">圆角半径</label>
              <span class="slider-value">{{ corner.radius }}px</span>
            </div>
            <input
              type="range"
              v-model.number="corner.radius"
              min="0"
              max="100"
              class="custom-slider"
            />
          </div>
        </div>
      </Transition>
    </div>

    <!-- 阴影设置 -->
    <div class="control-group">
      <div class="control-group-header" @click="shadow.enabled = !shadow.enabled">
        <div class="control-header-left">
          <div class="toggle-switch">
            <input type="checkbox" v-model="shadow.enabled" class="toggle-input" />
            <span class="toggle-slider"></span>
          </div>
          <div class="control-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="control-title">阴影效果</h3>
        </div>
        <svg :class="['chevron', { expanded: shadow.enabled }]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <Transition name="slide">
        <div v-if="shadow.enabled" class="control-group-body">
          <!-- 模糊度 -->
          <div class="control-item">
            <div class="slider-header">
              <label class="item-label">模糊程度</label>
              <span class="slider-value">{{ shadow.blur }}px</span>
            </div>
            <input
              type="range"
              v-model.number="shadow.blur"
              min="0"
              max="50"
              class="custom-slider"
            />
          </div>

          <!-- X 偏移 -->
          <div class="control-item">
            <div class="slider-header">
              <label class="item-label">水平偏移</label>
              <span class="slider-value">{{ shadow.offsetX }}px</span>
            </div>
            <input
              type="range"
              v-model.number="shadow.offsetX"
              min="-50"
              max="50"
              class="custom-slider"
            />
          </div>

          <!-- Y 偏移 -->
          <div class="control-item">
            <div class="slider-header">
              <label class="item-label">垂直偏移</label>
              <span class="slider-value">{{ shadow.offsetY }}px</span>
            </div>
            <input
              type="range"
              v-model.number="shadow.offsetY"
              min="-50"
              max="50"
              class="custom-slider"
            />
          </div>

          <!-- 阴影颜色 -->
          <div class="control-item">
            <label class="item-label">阴影颜色</label>

            <!-- 颜色建议 -->
            <div v-if="suggestedColors.length > 0" class="color-palette">
              <div
                v-for="color in suggestedColors"
                :key="color"
                @click="$emit('apply-shadow-color', color)"
                :class="['color-chip', { active: hexShadowColor === color }]"
                :style="{ backgroundColor: color }"
                :title="color"
              />
            </div>

            <div class="color-row">
              <div class="color-picker-wrapper">
                <input
                  type="color"
                  :value="hexShadowColor"
                  @input="shadow.color = rgbaToHex($event.target.value, shadowAlpha)"
                  class="color-picker-input"
                />
                <div class="color-preview" :style="{ backgroundColor: shadow.color }"></div>
              </div>
              <input
                type="range"
                v-model.number="shadowAlpha"
                min="0"
                max="1"
                step="0.05"
                class="opacity-slider"
              />
              <span class="color-hex">{{ Math.round(shadowAlpha * 100) }}%</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 导出设置 -->
    <div class="control-group">
      <div class="control-group-header no-toggle">
        <div class="control-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <h3 class="control-title">导出设置</h3>
      </div>

      <div class="control-group-body">
        <!-- 格式选择 -->
        <div class="control-item">
          <label class="item-label">图片格式</label>
          <div class="format-tabs">
            <button
              v-for="fmt in exportFormats"
              :key="fmt.value"
              @click="exportSettings.format = fmt.value"
              :class="['format-tab', { active: exportSettings.format === fmt.value }]"
            >
              {{ fmt.label }}
            </button>
          </div>
        </div>

        <!-- 质量设置 -->
        <div v-if="exportSettings.format !== 'png'" class="control-item">
          <div class="slider-header">
            <label class="item-label">图片质量</label>
            <span class="slider-value">{{ exportSettings.quality }}%</span>
          </div>
          <input
            type="range"
            v-model.number="exportSettings.quality"
            min="10"
            max="100"
            class="custom-slider"
          />
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="control-actions">
      <button @click="$emit('reset')" class="action-btn action-btn--secondary">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重置所有
      </button>
      <button
        @click="$emit('export')"
        :disabled="!imageData"
        class="action-btn action-btn--primary"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
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

// 边框样式选项
const borderStyles = [
  { value: 'solid', label: '实线' },
  { value: 'dashed', label: '虚线' },
  { value: 'double', label: '双线' },
];

// 导出格式选项
const exportFormats = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'webp', label: 'WebP' },
];

// 阴影透明度
const shadowAlpha = ref(0.3);

// 监听阴影颜色变化，同步更新透明度
watch(() => props.shadow.color, (val) => {
  const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match && match[4]) {
    shadowAlpha.value = parseFloat(match[4]);
  }
}, { immediate: true });

// 阴影颜色的 hex 值
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
  @apply flex flex-col h-full;
}

/* 控制组 */
.control-group {
  @apply border-b border-gray-100 last:border-b-0;
}

.control-group-header {
  @apply flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors;
}

.control-group-header.no-toggle {
  @apply cursor-default;
  pointer-events: none;
}

.control-header-left {
  @apply flex items-center gap-3;
}

.control-icon {
  @apply w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white shadow-md;
}

.control-icon svg {
  @apply w-4 h-4;
}

.control-title {
  @apply text-sm font-semibold text-gray-700;
}

.chevron {
  @apply w-5 h-5 text-gray-400 transition-transform duration-300;
}

.chevron.expanded {
  @apply rotate-180;
}

.control-group-body {
  @apply px-5 pb-5;
}

/* 开关切换 */
.toggle-switch {
  @apply relative w-10 h-6;
}

.toggle-input {
  @apply absolute inset-0 opacity-0 cursor-pointer;
}

.toggle-slider {
  @apply absolute inset-0 bg-gray-200 rounded-full transition-colors duration-300;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-slider {
  @apply bg-gradient-to-r from-violet-500 to-pink-500;
}

.toggle-slider::before {
  content: '';
  @apply absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300;
}

.toggle-input:checked + .toggle-slider::before {
  @apply translate-x-4;
}

/* 控制项 */
.control-item {
  @apply mb-4 last:mb-0;
}

.item-label {
  @apply block text-xs font-medium text-gray-600 mb-2;
}

/* 滑块 */
.slider-header {
  @apply flex items-center justify-between mb-2;
}

.slider-value {
  @apply text-xs font-mono font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-md;
}

.custom-slider {
  @apply w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer;
  background: linear-gradient(to right, #8b5cf6 0%, #ec4899 100%);
}

.custom-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer transition-transform duration-200;
  border: 3px solid #8b5cf6;
}

.custom-slider::-webkit-slider-thumb:hover {
  @apply scale-110;
}

.custom-slider::-moz-range-thumb {
  @apply w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer border-4;
  border-color: #8b5cf6;
}

/* 颜色选择器 */
.color-palette {
  @apply flex flex-wrap gap-2 mb-3;
}

.color-chip {
  @apply w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:scale-110 hover:shadow-md;
  border: 2px solid transparent;
}

.color-chip.active {
  @apply ring-2 ring-violet-500 ring-offset-2;
}

.color-row {
  @apply flex items-center gap-3;
}

.color-picker-wrapper {
  @apply relative w-10 h-10;
}

.color-picker-input {
  @apply absolute inset-0 opacity-0 cursor-pointer;
}

.color-preview {
  @apply w-10 h-10 rounded-xl shadow-inner border-2 border-white;
}

.color-hex {
  @apply text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg;
}

.opacity-slider {
  @apply flex-1 h-2 bg-gray-100 rounded-full appearance-none cursor-pointer;
}

.opacity-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-white rounded-full shadow cursor-pointer;
  border: 2px solid #8b5cf6;
}

/* 边框样式选项 */
.style-options {
  @apply flex gap-2;
}

.style-option {
  @apply flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-violet-300;
}

.style-option.active {
  @apply border-violet-500 bg-violet-50 text-violet-700;
}

.style-preview {
  @apply w-6 h-6 bg-gray-400;
}

.style-preview--solid {
  @apply bg-current;
}

.style-preview--dashed {
  @apply border-2 border-dashed border-current bg-transparent;
}

.style-preview--double {
  @apply relative;
}

.style-preview--double::before,
.style-preview--double::after {
  content: '';
  @apply absolute inset-0 border-2 border-current bg-transparent;
}

.style-preview--double::after {
  @apply inset-x-1 inset-y-1;
}

/* 格式选择 */
.format-tabs {
  @apply flex gap-2 p-1 bg-gray-50 rounded-xl;
}

.format-tab {
  @apply flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900;
}

.format-tab.active {
  @apply bg-white text-violet-600 shadow-sm;
}

/* 操作按钮 */
.control-actions {
  @apply flex gap-3 p-5 mt-auto;
}

.action-btn {
  @apply flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300;
}

.action-btn svg {
  @apply w-5 h-5;
}

.action-btn--primary {
  @apply bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02];
}

.action-btn--primary:disabled {
  @apply opacity-50 cursor-not-allowed hover:scale-100;
}

.action-btn--secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
