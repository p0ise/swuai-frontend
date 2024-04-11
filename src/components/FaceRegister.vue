<template>
  <v-container class="login-container" fluid>
    <v-card class="login-box mx-auto">
      <v-card-title class="text-center py-5 font-weight-black text-h5">欢迎注册</v-card-title>
      <v-card-text class="text-center">
        <div id="videoCanvasWrapper" class="d-flex justify-center position-relative ma-0 mb-7">
          <video id="videoElement" ref="videoElement" autoplay playsinline width="400" height="300"></video>
          <canvas id="overlay" ref="overlay" width="400" height="300"></canvas>
          <v-overlay id="videoPlaceholder" :model-value="!stream" persistent contained>
            摄像头未开启，请点击“摄像头开关”按钮。
          </v-overlay>
          <v-snackbar v-model="snackbar" :color="snackbarColor" variant="tonal" absolute attach="#videoCanvasWrapper"
            location="top" :text="snackbarText" class="mx-1">
            <template v-slot:actions>
              <v-btn variant="text" text="关闭" @click="snackbar = false"></v-btn>
            </template>
          </v-snackbar>
        </div>
        <v-text-field v-model="name" label="请输入用户名" variant="outlined" single-line></v-text-field>
        <v-switch v-model="isCameraActive" color="primary" :label="`摄像头${isCameraActive ? '开启' : '关闭'}`"
          @change="toggleCamera"></v-switch>
        <v-btn block size="x-large" variant="flat" color="primary" @click="register">注册</v-btn>
        <p class="text-register">已有账号？<router-link to="/login">点击登录</router-link></p>
      </v-card-text>
    </v-card>
    <!-- Modal Dialog for registration response -->
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card :color="dialogSuccess ? 'green lighten-4' : 'red lighten-4'" :text="dialogMessage" :title="dialogTitle">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ms-auto" text="关闭" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      isCameraActive: false,
      lastSentTimestamp: Date.now(),
      stream: null,
      streamingInterval: null,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      name: '',
      tranferScale: 0.5,
      dialog: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogSuccess: false
    };
  },
  mounted() {
    this.socket = io('ws://localhost:5000/api/face-auth');
    this.videoElement = this.$refs.videoElement;
    this.overlay = this.$refs.overlay;
    this.overlayCtx = overlay.getContext('2d');

    this.socket.on('connect', () => {
      console.log("Connected to Face Auth");
    });

    this.socket.on('detection_result', (data) => {
      if (this.stream) {
        // 清除之前的绘制
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        if (data.timestamp === this.lastSentTimestamp) {
          if (data.success && data.face) {
            // 清除之前的绘制
            this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
            const { location, landmark } = data.face;
            const scaleWidth = this.overlay.width / this.videoElement.videoWidth / this.tranferScale;
            const scaleHeight = this.overlay.height / this.videoElement.videoHeight / this.tranferScale;

            let [top, right, bottom, left] = location;
            // 调整人脸框位置和尺寸
            left *= scaleWidth;
            top *= scaleHeight;
            right *= scaleWidth;
            bottom *= scaleHeight;
            let width = right - left;
            let height = bottom - top;

            this.overlayCtx.strokeStyle = 'red';
            this.overlayCtx.lineWidth = 2;
            this.overlayCtx.font = '14px Arial';

            // 绘制人脸框
            this.overlayCtx.strokeRect(left, top, width, height);

            // 绘制关键点，考虑到缩放
            this.overlayCtx.fillStyle = 'blue'; // 设置关键点的颜色
            landmark.forEach(point => {
              let [x, y] = point;
              x *= scaleWidth;
              y *= scaleHeight;
              this.overlayCtx.beginPath();
              this.overlayCtx.arc(x, y, 2, 0, 2 * Math.PI); // 绘制小圆点标记关键点位置
              this.overlayCtx.fill();
            });
          } else if (data.message) {
            this.snackbarText = data.message;
            this.snackbarColor = 'warning';
            this.snackbar = true;
          }
        } else {
          console.debug('delay');
          // 显示一个提示用户数据延迟的消息
          // this.snackbarText = "数据可能已过时，请等待...";
          // this.snackbarColor = 'info';
          // this.snackbar = true;
        }
      }
    });


    this.socket.on('register_response', (data) => {
      this.dialog = true;
      this.dialogSuccess = data.success;
      if (data.success) {
        clearInterval(this.streamingInterval);
        this.videoElement.pause();
        this.dialogTitle = "注册成功";
        this.dialogMessage = data.message || `欢迎, ${this.name}!`;
      } else {
        this.dialogTitle = "注册失败";
        this.dialogMessage = data.message || "无法注册，请重试。";
      }
    });
  },
  methods: {
    toggleCamera() {
      if (this.isCameraActive) {
        this.startCamera();
      } else {
        this.stopCamera();
      }
    },
    sendFrame() {
      const currentTimestamp = Date.now();
      this.lastSentTimestamp = currentTimestamp;

      const scaledWidth = this.videoElement.videoWidth * this.tranferScale;
      const scaledHeight = this.videoElement.videoHeight * this.tranferScale;

      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      const context = canvas.getContext('2d');
      context.drawImage(this.videoElement, 0, 0, scaledWidth, scaledHeight);

      const data = canvas.toDataURL('image/jpeg');
      if (data && data.length > 0 && !data.endsWith('data:,')) {
        this.socket.emit('frame', { image: data, username: this.name, timestamp: currentTimestamp });
      } else {
        console.error("Captured frame is empty or invalid.");
      }
    },
    startCamera() {
      if (this.stream === null) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(mediaStream => {
            this.stream = mediaStream;
            this.videoElement.srcObject = mediaStream;

            this.streamingInterval = setInterval(this.sendFrame, 100);
          })
          .catch(err => {
            console.error("An error occurred: " + err);
          });
      }
    },
    stopCamera() {
      if (this.stream) {
        clearInterval(this.streamingInterval);
        this.stream.getTracks().forEach(track => track.stop());
        this.videoElement.srcObject = null;
        this.stream = null;
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        this.snackbar = false;
      }
    },
    register() {
      if (this.stream) {
        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;
        canvas.getContext('2d').drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/jpeg');
        if (data && data.length > 0 && !data.endsWith('data:,')) {
          if (this.name) {
            this.socket.emit('register', { image: data, username: this.name });
          } else {
            this.dialog = true;
            this.dialogSuccess = false;
            this.dialogTitle = "注册失败";
            this.dialogMessage = "用户名为空。";
          }
        } else {
          console.error("Captured frame is empty or invalid.");
        }
      } else {
        this.dialog = true;
        this.dialogSuccess = false;
        this.dialogTitle = "注册失败";
        this.dialogMessage = "请先开启摄像头！";
      }
    },
  },
  watch: {
    isCameraActive(newVal) {
      this.toggleCamera();
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
}

.login-box {
  padding: 30px 50px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
}

#videoCanvasWrapper {
  position: relative;
  width: 400px;
  height: 300px;
  background-color: #000;
  border: 4px solid #5A5A5A;
  border-radius: 8px;
  overflow: hidden;
}

#videoElement,
#overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

#videoPlaceholder {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  font-size: 16px;
  text-align: center;
}

.text-register {
  margin-top: 20px;
  text-align: center;
}

.text-register a {
  color: #2575fc;
  text-decoration: none;
}
</style>
