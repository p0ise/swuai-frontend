<template>
  <div class="login-container">
    <div class="login-box">
      <h2>欢迎登录</h2>
      <form @submit.prevent="" class="login-form">
        <v-row justify="center">
          <div id="videoCanvasWrapper" class="d-flex justify-center position-relative ma-0">
            <video id="video" ref="video" autoplay playsinline width="400" height="300"></video>
            <canvas id="overlay" ref="overlay" width="400" height="300"></canvas>
            <v-overlay id="videoPlaceholder" :model-value="!stream" persistent contained>
              摄像头未开启，请点击“开启摄像头”按钮。
            </v-overlay>
          </div>
        </v-row>

        <v-row class="justify-center">
          <v-col class="d-flex justify-center" style="max-width: 525px;">
            <v-btn @click="snackbar = true" color="red">test</v-btn>

            <v-snackbar v-model="snackbar" vertical color="success" class="snackbar-center">
              <div class="text-subtitle-1 pb-2">登录成功！</div>

              <p>用户姓名为: {{name}}</p>

              <template v-slot:actions>
                <v-btn
                  color="gray"
                  variant="text"
                  @click="snackbar = false"
                >
                  关闭
                </v-btn>
              </template>
            </v-snackbar>
          </v-col>
        </v-row>
        <v-switch class="switch1"
          v-model="model"
          color="indigo-darken-3"
          label="开关摄像头"
          hide-details
          inset
        ></v-switch>
        <button class="button1" type="submit">登录</button>
        <p class="text-register">还没有账号？<router-link to="/Register">注册</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      overlay: null,
      overlayCtx: null,
      lastSentTimestamp: Date.now(),
      stream: null,
      streamingInterval: null,
      snackbar: false,
      model: false,
      name: ''
    };
  },
  mounted() {
    if (this.model) {
      this.startCamera();
    }
    this.video = this.$refs.video;
    this.overlay = this.$refs.overlay;
    this.overlayCtx = overlay.getContext('2d');
  },
  watch: {
    model(newVal) {
      if (newVal) {
        this.startCamera();
      } else {
        this.stopCamera();
      }
    }
  },
  methods: {
    startCamera() {
      if (this.stream === null) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(mediaStream => {
            this.stream = mediaStream;
            this.video.srcObject = mediaStream;
            this.video.play();
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
        this.video.srcObject = null;
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

#video,
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

.input-group {
  position: relative;
  margin-bottom: 30px;
}

.input-group input {
  width: 100%;
  padding: 10px 0;
  background: none;
  border: none;
  outline: none;
  color: #333;
  font-size: 16px;
}

.input-group .bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #2575fc;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-group input:focus ~ .bar,
.input-group input:valid ~ .bar {
  transform: scaleX(1);
}

.switch1 {
  display: block;
  width: 30%;
  margin-left: auto;
  margin-right: auto;
}

.button1 {
  display: block;
  width: 30%;
  padding: 10px 0;
  border: none;
  background: #2575fc;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s ease;
  margin-left: auto;
  margin-right: auto;
}

button:hover {
  background: #6a11cb;
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
