<template>
  <div>
    <br />
    <label for="">Video</label>
    <input
      type="file"
      ref="videoInput"
      id="myInputID"
      accept="video/*"
      @input="onSelectFile(2)"
    />
    <br />
    <br />
    <label for="">Audio</label>
    <input
      type="file"
      ref="audioInput"
      accept="audio/*"
      @input="onSelectFile(3)"
    />
    <br />
    <br />
    <div class="mic">
      <label for="">Voice</label>
      <a id="download">Download</a>
      <button id="stop" @click="voiceMessage">Stop</button>
    </div>
    <h1>ImageCompressor</h1>
    <image-compressor :done="getFiles" :scale="100" :quality="20">
    </image-compressor>
    <div>
      <h2>ImageCompressor JS</h2>
      <input type="file" id="upload" @input="process" accept=".jpg, .jpeg, .png" />
      <div>
        <img id="input" />
      </div>
      <div>
        <img id="output" />
      </div>
    </div>
  </div>
</template>
<script>
import imageCompressor from "vue-image-compressor";
export default {
  name: "test",
  components: { imageCompressor },
  data() {
    return {
      voiceData: "",
      imageData:"",
    };
  },
  methods: {
    getFiles(obj) {
      console.log(obj);
    },
    process() {
      const file = document.querySelector("#upload").files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.readAsDataURL(file);
        
      reader.onload = function (event) {
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result;
        // document.querySelector("#input").src = event.target.result;

        imgElement.onload = function (e) {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;

          const scaleSize = MAX_WIDTH / e.target.width;
          canvas.width = MAX_WIDTH * 2;
          canvas.height = e.target.height * scaleSize * 2;
          console.log(canvas.width,canvas.height)

          const ctx = canvas.getContext("2d");

          ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

          console.log(ctx);
          const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");

          // you can send srcEncoded to the server
          document.querySelector("#output").src = srcEncoded;
          this.imageData = srcEncoded;
         localStorage.setItem("imageData",srcEncoded)
        };
      };
    },
    onSelectFile(type) {
      // For video
      if (type == 2) {
        let fileInput = this.$refs.videoInput;
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);

        reader.onload = function () {
          console.log(reader.result); //base64encoded string
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      }

      // For Audio
      if (type == 3) {
        let fileInput = this.$refs.audioInput;
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);

        reader.onload = function () {
          console.log(reader.result); //base64encoded string
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      }
    },
    voiceMessage() {
      const downloadLink = document.getElementById("download");
      const stopButton = document.getElementById("stop");

      const handleSuccess = function (stream) {
        const options = { mimeType: "audio/webm" };
        var recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener("dataavailable", function (e) {
          if (e.data.size > 0) recordedChunks.push(e.data);
          console.log(recordedChunks);
        });

        mediaRecorder.addEventListener("stop", async function () {
          let a = (downloadLink.href = URL.createObjectURL(
            new Blob(recordedChunks)
          ));

          recordedChunks = a;
          // console.log(recordedChunks);
          // downloadLink.download = "acetest.wav";
        });

        stopButton.addEventListener("click", function () {
          this.voiceData = recordedChunks;
          console.log(this.voiceData);
          mediaRecorder.stop();
        });

        mediaRecorder.start();
      };
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
    },
  },
  mounted(){
    setInterval(() => {
// console.log(localStorage.getItem('imageData'))
    }, 2000);
  }
};
</script>