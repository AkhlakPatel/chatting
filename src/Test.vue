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
  </div>
</template>
<script>
export default {
  name: "test",

  data() {
    return {
      voiceData: "",
    };
  },
  methods: {
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
};
</script>