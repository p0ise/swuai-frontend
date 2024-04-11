<template>
  <v-container class="login-container" fluid>
    <div class="login-box d-flex justify-center">
      <v-col class="justify-center" style="max-width: 400px;">
        <h2>欢迎登录</h2>
        <v-row justify="center mb-2">
          <div id="videoCanvasWrapper" class="d-flex justify-center position-relative ma-0">
            <video id="videoElement" ref="videoElement" autoplay playsinline height="300"></video>
            <canvas id="overlay" ref="overlay" width="400" height="300"></canvas>
            <v-overlay id="videoPlaceholder" :model-value="!stream" persistent contained>
              点击“开始登录”开始人脸认证。
            </v-overlay>
          </div>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-btn color="primary" @click="startLogin" class="mx-2">开始登录</v-btn>
          <v-btn color="error" @click="cancelLogin" class="mx-2">取消登录</v-btn>
        </v-row>
        <p class="text-login">没有账号？<router-link to="/Register">点击注册</router-link></p>

        <v-snackbar v-model="snackbar" :color="snackbarColor">
          {{ snackbarText }}
          <v-btn color="white" text @click="snackbar = false">关闭</v-btn>
        </v-snackbar>
      </v-col>
    </div>
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
      stream: null,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
    };
  },
  mounted() {
    this.socket = io('ws://localhost:5000/api/face-auth');
    this.videoElement = this.$refs.videoElement;
    this.overlay = this.$refs.overlay;
    this.overlayCtx = overlay.getContext('2d');

    this.socket.on('connect', () => {
      console.log("Connected to Face Recogition");
    });

    // Listen for server responses
    this.socket.on('login_response', (data) => {
      this.snackbarText = data.message;
      this.snackbarColor = data.success ? 'success' : 'error';
      this.snackbar = true;
      if (!data.success && data.message && data.message === "认证失败，未知人脸") {
        // If the user is unknown, prompt them to register
        this.snackbarText = "未知用户，请注册";
        this.snackbarColor = 'info';
      }
      if (data.success || data.message === "认证失败，未知人脸") {
        this.cancelLogin(); // Stop the camera on successful login or prompt to register
      }
    });
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
        this.socket.emit('login', { image: data, timestamp: currentTimestamp });
      } else {
        console.error("Captured frame is empty or invalid.");
      }
    },
    redraw() {
      if (this.stream) {
        // 清除之前的绘制
        this.overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);

        // 重新绘制所有人脸框和关键点
        this.lastDetectionResults.forEach(face => {
          const { id, location, name, prob, landmark } = face;
          const text = id ? name + "#" + id : name;
          let [top, right, bottom, left] = location;
          let width = right - left;
          let height = bottom - top;

          // 如果当前绘制的框是选中状态，使用特殊颜色或宽度高亮显示
          if (this.selectedFace && id === this.selectedFace.id) {
            this.overlayCtx.strokeStyle = 'yellow'; // 高亮颜色
            this.overlayCtx.lineWidth = 4; // 增加边框宽度以高亮显示
            this.overlayCtx.fillStyle = 'yellow';
          } else {
            this.overlayCtx.strokeStyle = 'red';
            this.overlayCtx.lineWidth = 2;
            this.overlayCtx.fillStyle = 'red';
          }
          this.overlayCtx.font = '14px Arial';

          // 绘制人脸框
          this.overlayCtx.strokeRect(left, top, width, height);
          this.overlayCtx.fillText(text, left, top - 10);

          // 绘制关键点
          this.overlayCtx.fillStyle = 'blue'; // 关键点的颜色
          landmark.forEach(point => {
            // 根据人脸框的缩放调整关键点的位置
            let [x, y] = point;
            this.overlayCtx.beginPath();
            this.overlayCtx.arc(x, y, 2, 0, 2 * Math.PI); // 绘制小圆点标记关键点位置
            this.overlayCtx.fill();
          });
        });
      }
    },
    startLogin() {
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
    cancelLogin() {
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
  },
  beforeUnmount() {
    // 清理工作
    this.cancelLogin();
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
  padding: 35px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 550px;
}

h2 {
  color: #333;
  margin-bottom: 40px;
  text-align: center;
}

#videoCanvasWrapper {
  position: relative;
  width: 400px;
  height: 300px;
  background-color: #93A5B1;
  border: 5px solid #C0C0C0;
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

.text-login {
  margin-top: 20px;
  text-align: center;
}

.text-login a {
  color: #2575fc;
  text-decoration: none;
}
</style>
