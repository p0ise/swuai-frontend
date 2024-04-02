<template>
  <div id="Facer">
    <h1>实时人脸检测与标注</h1>
    <div id="videoCanvasWrapper">
      <video id="videoElement" ref="videoElement" autoplay playsinline width="640" height="480"></video>
      <canvas id="overlay" ref="overlay" width="640" height="480"></canvas>
      <div id="videoPlaceholder">摄像头未开启，请点击“开启摄像头”按钮。</div>
    </div>
    <div class="controls">
      <button id="startCamera" @click="startCamera">开启摄像头</button>
      <button id="stopCamera" @click="stopCamera">关闭摄像头</button>
      <input type="text" v-model="selectedFaceIndex" placeholder="输入人脸编号">
      <input type="text" v-model="newName" placeholder="输入新名称">
      <button id="renameBtn" @click="renameFace">重命名</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      stream: null,
      streamingInterval: null,
      lastDetectionResults: [],
      selectedFace: null,
      selectedFaceIndex: '',
      newName: '',
      lastSentTimestamp: Date.now(),
    };
  },
  mounted() {
    this.connectToSocket();
  },
  methods: {
    connectToSocket() {
      this.socket = io('http://localhost:5000/api/face-recognition');

      this.socket.on('connect', () => {
        console.log('Connected');
      });

      this.socket.on('detection_results', (data) => {
        if (data.timestamp === this.lastSentTimestamp) {
          this.lastDetectionResults = data.faces;
          this.redraw();
        } else {
          this.lastDetectionResults = [];
        }
      });
    },
    sendFrame() {
      const video = this.$refs.videoElement;
      const currentTimestamp = Date.now();
      this.lastSentTimestamp = currentTimestamp;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/jpeg');
      if (data && data.length > 0 && !data.endsWith('data:,')) {
        this.socket.emit('frame', {image: data, timestamp: currentTimestamp});
      } else {
        console.error("Captured frame is empty or invalid.");
      }
    },
    redraw() {
      const overlay = this.$refs.overlay;
      const overlayCtx = overlay.getContext('2d');

      if (this.stream) {
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        this.lastDetectionResults.forEach(face => {
          const {index, location, name} = face;
          const text = name + "#" + index;
          let [top, right, bottom, left] = location;
          let width = right - left;
          let height = bottom - top;

          if (this.selectedFace && index === this.selectedFace.index) {
            overlayCtx.strokeStyle = 'yellow';
            overlayCtx.lineWidth = 4;
            overlayCtx.fillStyle = 'yellow';
          } else {
            overlayCtx.strokeStyle = 'red';
            overlayCtx.lineWidth = 2;
            overlayCtx.fillStyle = 'red';
          }
          overlayCtx.font = '14px Arial';

          overlayCtx.strokeRect(left, top, width, height);
          overlayCtx.fillText(text, left, top - 10);

          overlayCtx.strokeStyle = 'red';
          overlayCtx.lineWidth = 2;
        });
      }
    },
    handleOverlayClick(event) {
      const overlay = this.$refs.overlay;
      const rect = overlay.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedFace = this.lastDetectionResults.find(face => {
        const [top, right, bottom, left] = face.location;
        return x >= left && x <= right && y >= top && y <= bottom;
      });

      if (clickedFace) {
        this.selectedFaceIndex = clickedFace.index.toString();
        this.selectedFace = clickedFace;
        this.redraw();
      } else {
        this.selectedFace = null;
        this.redraw();
      }
    },
    startCamera() {
      if (this.stream === null) {
        navigator.mediaDevices.getUserMedia({video: true})
          .then((mediaStream) => {
            this.stream = mediaStream;
            this.$refs.videoElement.srcObject = mediaStream;
            this.streamingInterval = setInterval(this.sendFrame, 100);
            this.$refs.videoPlaceholder.style.display = 'none';
          })
          .catch((err) => {
            console.log("An error occurred: " + err);
          });
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.$refs.videoElement.srcObject = null;
        this.stream = null;
        clearInterval(this.streamingInterval);
        const overlay = this.$refs.overlay;
        overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
        this.$refs.videoPlaceholder.style.display = 'block';
      }
    },
    renameFace() {
      const faceIndex = parseInt(this.selectedFaceIndex, 10);
      if (!isNaN(faceIndex) && this.newName) {
        this.socket.emit('rename_face', {index: faceIndex, name: this.newName});
      } else {
        console.error("Face index is not a valid number or newName is empty.");
      }
    },
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.stopCamera();
  },
};
</script>

<style scoped>
/* CSS样式保持不变，直接从原始代码复制 */
#Facer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  font-family: Arial, sans-serif;
  text-align: center;
}

#videoCanvasWrapper {
  position: relative;
  width: 640px;
  height: 480px;
  margin-bottom: 20px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

#videoElement, #overlay {
  position: absolute;
  width: 100%;  /* 宽度设置为父容器的100% */
  height: 100%; /* 高度设置为父容器的100% */
  top: 0;
  left: 0;
  margin: auto;
}

#videoPlaceholder {
  color: #fff;
  text-align: center;
}

h1, h2 {
  color: #333;
  margin: 20px 0;
}

input[type="text"], button {
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  cursor: pointer;
  background-color: #f0f0f0;
}

button:hover {
  background-color: #e2e2e2;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
