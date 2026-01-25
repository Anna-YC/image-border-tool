<template>
  <div class="preview-container">
    <div class="preview-header">
      <h3 class="preview-title">预览</h3>
      <span v-if="imageInfo.width" class="preview-info">
        {{ imageInfo.width }} × {{ imageInfo.height }} px
      </span>
    </div>

    <div class="preview-canvas-wrapper" ref="wrapperRef">
      <canvas ref="canvasRef"></canvas>

      <div v-if="!imageData" class="preview-empty">
        <svg class="preview-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p>请先上传图片</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { fabric } from 'fabric';

const props = defineProps({
  imageData: String,
  border: Object,
  shadow: Object,
  corner: Object,
  imageInfo: Object,
});

const emit = defineEmits(['ready']);

const canvasRef = ref(null);
const wrapperRef = ref(null);
let fabricCanvas = null;

// 初始化 Fabric 画布
function initCanvas() {
  if (!canvasRef.value) return;

  fabricCanvas = new fabric.Canvas(canvasRef.value, {
    width: wrapperRef.value?.clientWidth || 600,
    height: wrapperRef.value?.clientHeight || 500,
    backgroundColor: '#f3f4f6',
    selection: false,
  });

  emit('ready', fabricCanvas);
}

// 加载图片到画布
async function loadImageToCanvas(dataUrl) {
  if (!fabricCanvas || !dataUrl) return;

  fabric.Image.fromURL(dataUrl, (img) => {
    fabricCanvas.clear();
    fabricCanvas.setBackgroundColor('#f3f4f6', fabricCanvas.renderAll.bind(fabricCanvas));

    // 缩放图片以适应画布
    const maxSize = Math.min(fabricCanvas.width, fabricCanvas.height) - 100;
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    img.scale(scale);

    // 计算缩放后的图片尺寸（用于布局计算）
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // 计算边框
    const borderWidth = props.border.enabled ? props.border.width * scale : 0;

    // 圆角半径（显示尺寸）
    const cornerRadius = props.corner.enabled ? props.corner.radius * scale : 0;

    // 创建边框（如果启用边框）
    if (borderWidth > 0) {
      // 边框内层尺寸（图片显示尺寸）
      const innerWidth = scaledWidth;
      const innerHeight = scaledHeight;

      // 边框圆角半径
      const borderCornerRadius = cornerRadius > 0
        ? cornerRadius + borderWidth  // 边框圆角 = 图片圆角 + 边框宽度
        : 0;

      // 根据样式创建边框
      if (props.border.style === 'solid') {
        // 实线：使用填充矩形
        const borderObj = new fabric.Rect({
          width: innerWidth + borderWidth * 2,
          height: innerHeight + borderWidth * 2,
          fill: props.border.color,
          rx: borderCornerRadius,
          ry: borderCornerRadius,
          originX: 'center',
          originY: 'center',
          left: fabricCanvas.width / 2,
          top: fabricCanvas.height / 2,
          selectable: false,
        });

        // 添加阴影到边框
        if (props.shadow.enabled) {
          borderObj.set('shadow', new fabric.Shadow({
            color: props.shadow.color,
            blur: props.shadow.blur * scale,
            offsetX: props.shadow.offsetX * scale,
            offsetY: props.shadow.offsetY * scale,
          }));
        }

        fabricCanvas.add(borderObj);
      } else if (props.border.style === 'dashed') {
        // 虚线：使用描边矩形
        const borderObj = new fabric.Rect({
          width: innerWidth + borderWidth,
          height: innerHeight + borderWidth,
          fill: 'transparent',
          stroke: props.border.color,
          strokeWidth: borderWidth,
          strokeDashArray: [borderWidth * 2, borderWidth], // 虚线模式
          rx: borderCornerRadius,
          ry: borderCornerRadius,
          originX: 'center',
          originY: 'center',
          left: fabricCanvas.width / 2,
          top: fabricCanvas.height / 2,
          selectable: false,
        });

        // 添加阴影到边框
        if (props.shadow.enabled) {
          borderObj.set('shadow', new fabric.Shadow({
            color: props.shadow.color,
            blur: props.shadow.blur * scale,
            offsetX: props.shadow.offsetX * scale,
            offsetY: props.shadow.offsetY * scale,
          }));
        }

        fabricCanvas.add(borderObj);
      } else if (props.border.style === 'double') {
        // 双线：创建两个矩形
        const outerWidth = innerWidth + borderWidth * 2;
        const outerHeight = innerHeight + borderWidth * 2;

        // 外层线
        const outerBorder = new fabric.Rect({
          width: outerWidth,
          height: outerHeight,
          fill: 'transparent',
          stroke: props.border.color,
          strokeWidth: borderWidth / 3,
          rx: borderCornerRadius,
          ry: borderCornerRadius,
          originX: 'center',
          originY: 'center',
          left: fabricCanvas.width / 2,
          top: fabricCanvas.height / 2,
          selectable: false,
        });

        // 内层线
        const innerBorder = new fabric.Rect({
          width: innerWidth + borderWidth * 0.8,
          height: innerHeight + borderWidth * 0.8,
          fill: 'transparent',
          stroke: props.border.color,
          strokeWidth: borderWidth / 3,
          rx: Math.max(0, borderCornerRadius - borderWidth),
          ry: Math.max(0, borderCornerRadius - borderWidth),
          originX: 'center',
          originY: 'center',
          left: fabricCanvas.width / 2,
          top: fabricCanvas.height / 2,
          selectable: false,
        });

        // 添加阴影到外层边框
        if (props.shadow.enabled) {
          outerBorder.set('shadow', new fabric.Shadow({
            color: props.shadow.color,
            blur: props.shadow.blur * scale,
            offsetX: props.shadow.offsetX * scale,
            offsetY: props.shadow.offsetY * scale,
          }));
        }

        fabricCanvas.add(outerBorder);
        fabricCanvas.add(innerBorder);
      }
    }

    // 设置图片属性并应用缩放
    img.set({
      originX: 'center',
      originY: 'center',
      left: fabricCanvas.width / 2,
      top: fabricCanvas.height / 2,
    });
    img.scale(scale);

    // 圆角裁剪（应用到图片）
    // 重要：clipPath 使用原始图片尺寸（Fabric.js 本地坐标系）
    if (cornerRadius > 0) {
      // clipPath 的圆角半径需要用原始尺寸，因为 clipPath 在对象本地坐标系中
      const originalCornerRadius = props.corner.radius;  // 不缩放，使用原始值

      const clipPath = new fabric.Rect({
        width: img.width,    // 原始宽度，不是 scaledWidth
        height: img.height,  // 原始高度，不是 scaledHeight
        rx: originalCornerRadius,
        ry: originalCornerRadius,
        originX: 'center',
        originY: 'center',
      });
      img.clipPath = clipPath;
    }

    fabricCanvas.add(img);
    fabricCanvas.renderAll();
  });
}

// 更新效果（不重新加载图片）
function updateEffects() {
  if (!fabricCanvas || !props.imageData) return;
  loadImageToCanvas(props.imageData);
}

// 监听图片数据变化
watch(() => props.imageData, (newVal) => {
  if (newVal) {
    nextTick(() => {
      loadImageToCanvas(newVal);
    });
  } else {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.setBackgroundColor('#f3f4f6');
      fabricCanvas.renderAll();
    }
  }
});

// 监听效果变化
watch([() => props.border, () => props.shadow, () => props.corner], () => {
  updateEffects();
}, { deep: true });

onMounted(() => {
  initCanvas();
});

onUnmounted(() => {
  fabricCanvas?.dispose();
});
</script>

<style scoped>
.preview-container {
  @apply flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden;
}

.preview-header {
  @apply flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200;
}

.preview-title {
  @apply text-sm font-medium text-gray-700;
}

.preview-info {
  @apply text-xs text-gray-500;
}

.preview-canvas-wrapper {
  @apply relative flex-1 flex items-center justify-center p-4 overflow-auto;
}

.preview-canvas-wrapper canvas {
  @apply max-w-full max-h-full shadow-lg;
}

.preview-empty {
  @apply flex flex-col items-center justify-center text-gray-400;
}

.preview-empty-icon {
  @apply w-16 h-16 mb-2 text-gray-300;
}

.preview-empty p {
  @apply text-sm;
}
</style>
