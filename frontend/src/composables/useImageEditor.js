import { ref, reactive, watch } from 'vue';
import { extractColors } from '../utils/colorExtractor';
import { processImage as processImageCanvas, canvasToDataURL, canvasToBlob } from '../utils/canvasProcessor';

/**
 * 图片编辑器状态管理
 */
export function useImageEditor() {
  // 原始图片数据
  const originalImage = ref(null);

  // 当前图片数据（base64）
  const currentImage = ref(null);

  // 图片元信息
  const imageInfo = reactive({
    width: 0,
    height: 0,
    size: 0,
    name: '',
  });

  // 从图片提取的颜色建议
  const suggestedColors = ref([]);

  // 边框设置
  const border = reactive({
    enabled: true,
    width: 20,
    color: '#3b82f6',
    style: 'solid', // solid, dashed, double
  });

  // 阴影设置
  const shadow = reactive({
    enabled: false,
    blur: 20,
    offsetX: 10,
    offsetY: 10,
    color: 'rgba(0, 0, 0, 0.3)',
  });

  // 圆角设置
  const corner = reactive({
    enabled: false,
    radius: 16,
  });

  // 导出设置
  const exportSettings = reactive({
    format: 'png', // png, jpg, webp
    quality: 90,
  });

  // 加载图片
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          originalImage.value = e.target.result;
          currentImage.value = e.target.result;

          imageInfo.width = img.width;
          imageInfo.height = img.height;
          imageInfo.size = file.size;
          imageInfo.name = file.name;

          // 提取图片颜色
          try {
            const colors = await extractColors(e.target.result, 5);
            suggestedColors.value = colors;
          } catch (error) {
            console.error('颜色提取失败:', error);
            suggestedColors.value = [];
          }

          resolve(e.target.result);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 重置设置
  function resetSettings() {
    border.width = 20;
    border.color = '#3b82f6';
    border.style = 'solid';
    shadow.enabled = false;
    shadow.blur = 20;
    shadow.offsetX = 10;
    shadow.offsetY = 10;
    corner.enabled = false;
    corner.radius = 16;
    suggestedColors.value = [];
  }

  // 应用颜色到边框
  function applyColorToBorder(hexColor) {
    border.color = hexColor;
  }

  // 应用颜色到阴影（转换为 rgba）
  function applyColorToShadow(hexColor) {
    // 从 hex 转换到 rgba，保持当前透明度
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // 提取当前透明度
    const currentAlpha = parseFloat(shadow.color.match(/[\d.]+\)$/)?.[0]) || 0.3;

    shadow.color = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
  }

  // 获取处理选项
  function getProcessOptions() {
    return {
      borderWidth: border.enabled ? border.width : 0,
      borderColor: border.color,
      borderStyle: border.style,
      cornerRadius: corner.enabled ? corner.radius : 0,
      shadowEnabled: shadow.enabled,
      shadowBlur: shadow.blur,
      shadowOffsetX: shadow.offsetX,
      shadowOffsetY: shadow.offsetY,
      shadowColor: shadow.color,
      format: exportSettings.format,
      quality: exportSettings.quality,
    };
  }

  // 处理图片（纯前端 Canvas）
  async function processImage() {
    if (!currentImage.value) return null;

    try {
      // 加载原始图片为 Image 对象
      const img = new Image();
      img.src = currentImage.value;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // 使用 Canvas 处理图片
      const canvas = await processImageCanvas(img, getProcessOptions());
      return canvasToDataURL(canvas, exportSettings.format, exportSettings.quality / 100);
    } catch (error) {
      console.error('处理失败:', error);
      throw error;
    }
  }

  // 下载图片（纯前端 Canvas）
  async function downloadImage(filename) {
    if (!currentImage.value) return;

    try {
      // 加载原始图片为 Image 对象
      const img = new Image();
      img.src = currentImage.value;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // 使用 Canvas 处理图片
      const canvas = await processImageCanvas(img, getProcessOptions());

      // 转换为 Blob 并下载
      const blob = await canvasToBlob(canvas, exportSettings.format, exportSettings.quality / 100);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `bordered-${Date.now()}.${exportSettings.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      throw error;
    }
  }

  return {
    // 状态
    originalImage,
    currentImage,
    imageInfo,
    border,
    shadow,
    corner,
    exportSettings,
    suggestedColors,

    // 方法
    loadImage,
    resetSettings,
    getProcessOptions,
    processImage,
    downloadImage,
    applyColorToBorder,
    applyColorToShadow,
  };
}
