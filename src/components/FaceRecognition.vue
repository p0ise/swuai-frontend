<template>
  <v-container class="text-center pa-0">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 py-4">实时人脸检测与标注</h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <div id="videoCanvasWrapper" class="d-flex justify-center position-relative ma-0">
        <video id="videoElement" ref="videoElement" autoplay playsinline width="640" height="480"></video>
        <canvas id="overlay" ref="overlay" width="640" height="480"></canvas>
        <v-overlay id="videoPlaceholder" :model-value="!stream" persistent contained>
          摄像头未开启，请点击“开启摄像头”按钮。
        </v-overlay>
      </div>
    </v-row>

    <v-row class="justify-center">
      <v-col class="d-flex justify-center" style="max-width: 675px;">
        <v-btn id="startCamera" @click="startCamera" color="primary" class="mx-2">开启摄像头</v-btn>
        <v-btn id="stopCamera" @click="stopCamera" color="error" class="mx-2">关闭摄像头</v-btn>
        <v-text-field v-model="selectedFaceIndex" label="输入人脸编号" variant="outlined" density="compact"
          class="mx-2"></v-text-field>
        <v-text-field v-model="newName" label="输入新名称" variant="outlined" density="compact" class="mx-2"></v-text-field>
        <v-btn id="renameBtn" @click="renameFace" color="secondary" class="mx-2">重命名</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      videoElement: null,
      overlay: null,
      overlayCtx: null,
      lastSentTimestamp: Date.now(),
      stream: null,
      streamingInterval: null,
      lastDetectionResults: [],
      selectedFace: null,
      selectedFaceIndex: '',
      newName: ''
    };
  },
  mounted() {
    this.socket = io('http://localhost:5000/api/face-recognition');
    this.videoElement = this.$refs.videoElement;
    this.overlay = this.$refs.overlay;
    this.overlayCtx = overlay.getContext('2d');

    this.socket.on('connect', () => {
      console.log("Connected");
    });

    this.socket.on('detection_results', (data) => {
      if (this.stream) {
        // 清除之前的绘制
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        if (data.timestamp === this.lastSentTimestamp) {
          this.lastDetectionResults = data.faces; // 更新最近一次的检测结果
          this.redraw();
        } else {
          this.lastDetectionResults = [];
        }
      }
    });

    // 绑定点击事件到canvas
    this.overlay.addEventListener('click', this.canvasClick);
  },
  methods: {
    sendFrame() {
      const currentTimestamp = Date.now();
      this.lastSentTimestamp = currentTimestamp;
      const canvas = document.createElement('canvas');
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;
      canvas.getContext('2d').drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/jpeg');
      if (data && data.length > 0 && !data.endsWith('data:,')) {
        this.socket.emit('frame', { image: data, timestamp: currentTimestamp });
      } else {
        console.error("Captured frame is empty or invalid.");
      }
    },
    redraw() {
      if (this.stream) {
        // 清除之前的绘制
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);

        // 重新绘制所有人脸框
        this.lastDetectionResults.forEach(face => {
          const { index, location, name } = face;
          const text = name + "#" + index;
          let [top, right, bottom, left] = location;
          let width = right - left;
          let height = bottom - top;

          // 如果当前绘制的框是选中状态，使用特殊颜色或宽度高亮显示
          if (this.selectedFace && index === this.selectedFace.index) {
            this.overlayCtx.strokeStyle = 'yellow'; // 高亮颜色
            this.overlayCtx.lineWidth = 4; // 增加边框宽度以高亮显示
            this.overlayCtx.fillStyle = 'yellow';
          } else {
            this.overlayCtx.strokeStyle = 'red';
            this.overlayCtx.lineWidth = 2;
            this.overlayCtx.fillStyle = 'red';
          }
          this.overlayCtx.font = '14px Arial';

          this.overlayCtx.strokeRect(left, top, width, height);
          this.overlayCtx.fillText(text, left, top - 10);

          // 重置为默认状态以供下一个框使用
          this.overlayCtx.strokeStyle = 'red';
          this.overlayCtx.lineWidth = 2;
        });
      }
    },
    startCamera() {
      if (this.stream === null) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(mediaStream => {
            this.stream = mediaStream;
            this.videoElement.srcObject = mediaStream;
            this.videoElement.play();
            this.streamingInterval = setInterval(this.sendFrame, 100);
          })
          .catch(err => {
            console.error("An error occurred: " + err);
          });
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.videoElement.srcObject = null;
        this.stream = null;
        clearInterval(this.streamingInterval);
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        this.lastDetectionResults = null;
        this.selectedFace = null;
      }
    },
    renameFace() {
      const faceIndexStr = this.selectedFaceIndex;
      const newName = this.newName;
      // 明确检查faceIndexStr是否不是null或undefined
      if (faceIndexStr !== null && faceIndexStr !== undefined && newName) {
        // 将faceIndex字符串转换为整数
        const faceIndex = parseInt(faceIndexStr, 10);
        // 确保转换成功，parseInt会在转换失败时返回NaN
        if (!isNaN(faceIndex)) {
          const data = { index: faceIndex, name: newName };
          this.socket.emit('rename_face', data); // 发送索引和新名称到后端
        } else {
          console.error("Face index is not a valid number.");
        }
      } else {
        console.error("Face index or new name is not provided.");
      }
    },
    canvasClick(e) {
      if (this.stream) {
        // Obtain the position of the canvas on the page
        const rect = this.overlay.getBoundingClientRect();
        // Calculate the click position relative to the canvas
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find the face that was clicked on
        const clickedFace = this.lastDetectionResults.find(face => {
          const [top, right, bottom, left] = face.location;
          return x >= left && x <= right && y >= top && y <= bottom;
        });

        if (clickedFace) {
          // Update the selected face in the component's data
          this.selectedFaceIndex = clickedFace.index;
          this.selectedFace = clickedFace;
        } else {
          this.selectedFace = null;
        }
        // Trigger a redraw to show the new highlighted state or clear the previous highlight
        this.redraw();
      }
    }
  },
  beforeUnmount() {
    // 清理工作
    this.stopCamera();
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style scoped>
#videoCanvasWrapper {
  position: relative;
  width: 640px;
  height: 480px;
  background-color: #000;
}

#videoElement,
#overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

#videoPlaceholder {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
