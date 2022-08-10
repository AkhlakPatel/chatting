<template>
  <div>
    <div class="content_container">
      <div class="">
        <h2 class="text-center">
          {{ senderNicknameInput }} sending, {{ receiverNicknameInput }}
          receiving!
        </h2>
      </div>
      <div class="msg-content" id="chatsection">
        <div class="loading" v-if="loading">
          <h5>Loading....</h5>
        </div>
        <div v-for="item in result" :key="item.id">
          <div>
            <!-- Hanldle Text -->
            <h3
              v-if="item.type == 0"
              v-bind:class="[
                item.sender.name == senderNicknameInput
                  ? 'msg-right'
                  : 'msg-left',
              ]"
            >
              {{ item.text }}
            </h3>

            <!-- Handle Images -->
            <!-- <div v-if="item.type == 1"> -->
            <img
              v-if="item.type == 1"
              :src="item.mediaUrl.url"
              alt=""
              class="imageUrl"
              v-bind:class="[
                item.sender.name == senderNicknameInput
                  ? 'msg-right'
                  : 'msg-left',
              ]"
            />
            <!-- Handle Video -->
            <div v-if="item.type == 2">
              <!-- {{ item.mediaUrl.url }} -->

              <video
                width="320"
                height="240"
                controls
                class="videoUrl"
                v-bind:class="[
                  item.sender.name == senderNicknameInput
                    ? 'msg-right'
                    : 'msg-left',
                ]"
              >
                <source :src="item.mediaUrl.url" />
                <source src="movie.ogg" type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>

            <!-- Handle Audio -->
            <div v-if="item.type == 3">
              <audio
                class="audioUrl"
                controls
                v-bind:class="[
                  item.sender.name == senderNicknameInput
                    ? 'msg-right'
                    : 'msg-left',
                ]"
              >
                <source :src="item.mediaUrl.url" type="audio/ogg" />
                <source src="horse.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            <!-- Handle like -->
            <div v-if="item.type == 4">
              <i
                class="fa-solid fa-thumbs-up"
                v-bind:class="[
                  item.sender.name == senderNicknameInput
                    ? 'msg-right'
                    : 'msg-left',
                ]"
              ></i>
            </div>

            <!-- {{item.text}} for text-->
            <!-- {{item.imageUrl.url}} for images -->
          </div>
        </div>
        <div>
          <!-- <div class="imageUrl msg-right sending_div" v-if="sending">
              <p>Sending, Please Wait...</p>
            </div> -->
        </div>
      </div>
      <div class="new_message">
        <!-- <h2 class="new_message_title">New message</h2> -->

        <div class="input">
          <input
            class="input_button form_input"
            placeholder="Your message..."
            v-model="messageInput"
            @keyup.enter="sendmsg"
          />

          <div class="upload-icon">
            <!--  1 for Images -->
            <!-- <input
              type="file"
              id="upload-file"
              style="display: none"
              ref="fileInput"
              @input="onSelectFile(1)"
              accept="image/png, image/gif, image/jpeg"
              @keyup.enter="sendmsg"
            /> -->
            <input
              type="file"
              id="uploadImage"
              ref="fileInput"
              style="display: none"
              @input="onSelectImage"
              accept="image/png, image/gif, image/jpeg"
              @keyup.enter="sendmsg"
            />
            <!--  2 for videos -->
            <input
              type="file"
              id="upload-file"
              style="display: none"
              ref="videoInput"
              @input="onSelectFile(2)"
              accept="video/*"
              @keyup.enter="sendmsg"
            />
            <!-- 3 for Audios -->
            <input
              type="file"
              id="upload-file"
              style="display: none"
              ref="audioInput"
              @input="onSelectFile(3)"
              accept="audio/*"
              @keyup.enter="sendmsg"
            />

            <div class="input_icons">
              <div class="media">
                <div v-if="mediaIconShow" class="media">
                  <div class="media_icon">
                    <i class="fa-solid fa-image" @click="handleFile"></i>
                  </div>
                  <div class="media_icon">
                    <i class="fa-solid fa-video" @click="handleVideo"></i>
                  </div>
                  <div class="media_icon">
                    <i class="fa-solid fa-headphones" @click="handleAudio"></i>
                  </div>
                </div>

                <label
                  v-if="plusIconShow"
                  for="upload-file"
                  class="fa-solid fa-plus upload-like-icon"
                  @click="handlePlusIcon"
                ></label>
                <i class="fa-solid fa-thumbs-up like" @click="handleLike"></i>
                <div class="voice-message">
                  <i
                    v-bind:class="[
                      showVoice
                        ? 'fa-solid fa-microphone'
                        : 'fa-solid fa-microphone-slash',
                    ]"
                    id="stop"
                    @click="voiceMessage"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <!--Icon Functionality Start  -->
          <emoji-picker @emoji="append" :search="search">
            <button
              class="emoji-invoker"
              slot="emoji-invoker"
              slot-scope="{ events: { click: clickEvent } }"
              @click.stop="clickEvent"
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 fill-current text-grey"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
                />
              </svg>
            </button>
            <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
              <div
                class="emoji-picker"
                :style="{ top: display.y + 'px', left: display.x + 'px' }"
              >
                <div class="emoji-picker__search">
                  <input type="text" v-model="search" v-focus />
                </div>
                <div>
                  <div v-for="(emojiGroup, category) in emojis" :key="category">
                    <h5>{{ category }}</h5>
                    <div class="emojis">
                      <span
                        v-for="(emoji, emojiName) in emojiGroup"
                        :key="emojiName"
                        @click="insert(emoji)"
                        :title="emojiName"
                        >{{ emoji }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </emoji-picker>
          <!--Icon Functionality End  -->

          <i class="fa-solid fa-share send_msg_btn" @click="sendmsg"></i>
        </div>
        <!-- <button class="send_msg_btn" @click="sendmsg">Send message</button> -->
        <!-- <div>
          <button @click="voiceMessage">Start</button>
          <button id="stop">Stop</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
const Parse = require("parse");
import EmojiPicker from "vue-emoji-picker";
export default {
  name: "LiveChat",
  props: {
    senderNicknameInput: String,
    senderNicknameId: String,
    receiverNicknameInput: String,
    receiverNicknameId: String,
  },
  components: {
    EmojiPicker,
  },
  data() {
    return {
      messageInput: "",
      result: {},
      // image: "",
      imageData: "",
      videoData: "",
      like: false,
      search: "", // for Icon/Emogi search
      mediaIconShow: false,
      plusIconShow: true,
      loading: true,
      sending: false,
      showVoice: true,
    };
  },
  methods: {
    // ======================== Define Functions ===========================
    async liveChat() {
      const parseQuery = new Parse.Query("Message");
      // get messages that involve both nicknames

      parseQuery.containedIn("sender", [
        this.senderNicknameId,
        this.receiverNicknameId,
      ]); // AP & Bp

      parseQuery.containedIn("receiver", [
        this.senderNicknameId,
        this.receiverNicknameId,
      ]);

      // Set result ordering
      parseQuery.ascending("createdAt");

      // Include nickname fields, to enable name getting on list
      parseQuery.includeAll();

      Parse.liveQueryServerURL = "ws://testlivechat.b4a.io";
      const subscribe = await parseQuery.subscribe();
      let allMessages = {};

      const showMessages = () => {
        let results = [];
        Object.keys(allMessages).forEach((id) => {
          console.log(allMessages[id].toJSON());
          results.push(allMessages[id].toJSON());
        });
        this.result = results;
        console.log(this.result);
      };

      subscribe.on("open", async () => {
        console.log("subsribed open ");
        allMessages = (await parseQuery.find()).reduce(
          (allMessages, msg) => ({
            ...allMessages,
            [msg.id]: msg,
          }),
          allMessages
        );
        showMessages();
        console.log(this.result);
        this.loading = false;
      });
      subscribe.on("create", async (msg) => {
        console.log("new message send", msg.id);
        allMessages[msg.id] = msg;
        showMessages();
        // this.getPhoto();
      });
    },

    // Message sender handler
    async sendMessage() {
      try {
        const messageText = this.messageInput;
        // For handle Image
        let imageData = localStorage.getItem("imageData");
        let voiceData = localStorage.getItem("voiceData");

        // Get sender and receiver nickname Parse objects
        const senderNicknameObjectQuery = new Parse.Query("Nickname");
        senderNicknameObjectQuery.equalTo("objectId", this.senderNicknameId);
        let senderNicknameObject = await senderNicknameObjectQuery.first();
        const receiverNicknameObjectQuery = new Parse.Query("Nickname");
        receiverNicknameObjectQuery.equalTo(
          "objectId",
          this.receiverNicknameId
        );
        let receiverNicknameObject = await receiverNicknameObjectQuery.first();

        // Create new Message object and save it
        let Message = new Parse.Object("Message");

        // Handle Text for send message
        if (this.messageInput !== "") {
          console.log("Text sending..");
          Message.set("text", messageText);
          Message.set("type", 0);
          Message.set("sender", senderNicknameObject);
          Message.set("receiver", receiverNicknameObject);
          Message.save();
          // Clear input
          this.messageInput = "";
        }

        // Handle image for send file
        else if (
          imageData !== "" &&
          imageData !== null &&
          imageData !== undefined
        ) {
          console.log("Image sending..");
          this.sending = true;
          const base64 = imageData;
          let type = base64.substring(
            "data:image/".length,
            base64.indexOf(";base64")
          );
          const file = new Parse.File("myfile" + "." + type, {
            base64: base64,
          });
          Message.set("mediaUrl", file);
          Message.set("type", 1);
          Message.set("sender", senderNicknameObject);
          Message.set("receiver", receiverNicknameObject);
          const res = await Message.save();
          this.sending = false;
          if (res) {
            console.log("Success Image", res);
            // this.imageData = "";
            localStorage.removeItem("imageData");
          }
        }

        // Handle Voice for send file
        else if (
          voiceData !== "" &&
          voiceData !== null &&
          voiceData !== undefined
        ) {
          console.log("Voice sending..");
          this.sending = true;
          let base64 = voiceData;
          let type = base64.substring(
            "data:image/".length,
            base64.indexOf(";base64")
          );
          const file = new Parse.File("myfile" + "." + type, {
            base64: base64,
          });
          Message.set("mediaUrl", file);
          Message.set("type", 3);
          Message.set("sender", senderNicknameObject);
          Message.set("receiver", receiverNicknameObject);
          const res = await Message.save();
          this.sending = false;
          if (res) {
            console.log("Success Voice", res);
          }
          localStorage.removeItem("voiceData");
        }

        // Handle video data for send
        else if (this.videoData !== "" && this.videoData !== undefined) {
          console.log("Video sending..");
          const base64 = this.videoData;
          let type = base64.substring(
            "data:video/".length,
            base64.indexOf(";base64")
          );
          console.log(type);
          const video = new Parse.File("myVideo", {
            base64: base64,
          });
          Message.set("mediaUrl", video);
          Message.set("type", 2);
          Message.set("sender", senderNicknameObject);
          Message.set("receiver", receiverNicknameObject);
          const res = await Message.save();
          if (res) {
            console.log("Success Video", res);
            this.videoData = "";
          }
        }

        // Handle Audio data for send
        else if (this.audioData !== "" && this.audioData !== undefined) {
          console.log("Audio sending..");
          const base64 = this.audioData;
          let type = base64.substring(
            "data:video/".length,
            base64.indexOf(";base64")
          );
          console.log(type);
          const audio = new Parse.File("myVideo", {
            base64: base64,
          });
          Message.set("mediaUrl", audio);
          Message.set("type", 3);
          Message.set("sender", senderNicknameObject);
          Message.set("receiver", receiverNicknameObject);
          const res = await Message.save();
          if (res) {
            console.log("Success Audio", res);
            this.audioData = "";
          }
        }

        // handle like for send
        else if (this.like == true) {
          Message.set("type", 4);
          Message.set("sender", senderNicknameObject);
          Message.set("receiver", receiverNicknameObject);
          const res = await Message.save();
          if (res) console.log("Success", res);
          this.like = false;
        }
      } catch (error) {
        alert(error);
      }
    },
    // function for send message
    sendmsg() {
      this.sendMessage();
    },

    //  Handle chat scroll bottom always
    handleChatSection() {
      const chatSection = document.getElementById("chatsection");
      chatSection.scrollTop =
        chatSection.scrollHeight - chatSection.clientHeight;
    },

    handlePlusIcon() {
      this.mediaIconShow = true;
      this.plusIconShow = false;
    },

    // function for handle upload file
    handleFile() {
      this.$refs.fileInput.click();
    },
    handleVideo() {
      this.$refs.videoInput.click();
    },
    handleAudio() {
      this.$refs.audioInput.click();
    },

    onSelectImage() {
      const file = document.querySelector("#uploadImage").files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = function (event) {
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result;

        imgElement.onload = function (e) {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;

          const scaleSize = MAX_WIDTH / e.target.width;
          canvas.width = MAX_WIDTH;
          canvas.height = e.target.height * scaleSize;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

          const srcEncoded = ctx.canvas.toDataURL("image/jpeg", 50);

          localStorage.setItem("imageData", srcEncoded);
        };
      };
    },

    onSelectFile(type) {
      var input;
      if (type == 1) {
        input = this.$refs.fileInput;
        this.videoData = "";
        this.audioData = "";
      } else if (type == 2) {
        input = this.$refs.videoInput;
        this.imageData = "";
        this.audioData = "";
      } else if (type == 3) {
        input = this.$refs.audioInput;
        this.imageData = "";
        this.videoData = "";
      }
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type == 1) {
            this.imageData = e.target.result;
            console.log(this.imageData);
          } else if (type == 2) {
            this.videoData = e.target.result;
            console.log(this.videoData);
          } else if (type == 3) {
            this.audioData = e.target.result;
          }
        };
        reader.readAsDataURL(files[0]);
        this.$emit("input", files[0]);
        this.plusIconShow = true;
        this.mediaIconShow = false;
      }
    },

    // Audio
    voiceMessage() {
      this.showVoice = !this.showVoice;
      const stopButton = document.getElementById("stop");
      const handleSuccess = function (stream) {
        const options = { mimeType: "audio/webm" };
        var recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.addEventListener("dataavailable", function (e) {
          if (e.data.size > 0) recordedChunks.push(e.data);
          console.log(recordedChunks);
          var file = new File(recordedChunks, "name");
          console.log(file);
          //
          function getBase64(file) {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (error) => reject(error);
            });
          }
          getBase64(file).then((data) => {
            data = data.split(",")[1];
            console.log(data);
            localStorage.setItem("voiceData", data);
          });

          //
        });

        stopButton.addEventListener("click", function () {
          mediaRecorder.stop();
        });
        mediaRecorder.start();
      };
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })

        .then(handleSuccess);
        
    },

   
    // Audio

    // async sendPhoto() {
    //   const base64 = this.image;
    //   let type = base64.substring(
    //     "data:image/".length,
    //     base64.indexOf(";base64")
    //   );
    //   console.log(type);
    //   const file = new Parse.File("myfile" + "." + type, { base64: base64 });
    //   const Photo = new Parse.Object("Photo");

    //   Photo.set("name", "testphoto");
    //   Photo.set("Photo", file);
    //   await Photo.save();
    //   console.log("Success");
    // },

    // Funtion for Emogi
    append(emoji) {
      this.messageInput += emoji;
      console.log(this.messageInput);
    },

    handleLike() {
      this.like = true;
      this.sendmsg();
    },
  },

  // for emogi
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
  created() {
    this.liveChat();
    localStorage.removeItem("imageData");
    localStorage.removeItem("voiceData");
    setInterval(() => {
      //  console.log(this.imageData);
    }, 3000);
  },
  updated() {
    this.handleChatSection();
  },
};
</script>

<style>
.messages {
  width: 100%;
  background-color: rgb(146, 184, 255);
  min-width: 400px;
  min-height: 200px;
  padding: 20px;
  border: 2px solid #208aec;
}

.send_msg_btn {
  background-color: #208aec;
  padding: 10px;
  margin-left: 21px;
  position: relative;
  top: -3.655rem;
  left: 18rem;
}
.send_photo_btn {
  background-color: #208aec;
  padding: 10px;
  margin-left: 10px;
}
.left_msg {
  float: left;
  /* display: block; */
  width: 450px;
}

.right_msg {
  float: right;
  /* display: block; */
}

.text-center {
  text-align: center;
  padding-bottom: 2px;
}

.name {
  float: right;
  color: rgb(121, 117, 117);
}

.msg-left {
  float: left;
  background-color: #8995a1;
  /* width: 300px; */
  padding: 2px;
  margin: auto;
  margin-bottom: 10px;
  display: block;
  margin-bottom: 10px;
  margin-right: 5px;
  border-radius: 10px;
}
.msg-right {
  display: block;
  float: right;
  background-color: #4396e4;
  /* width: 300px; */
  padding: 2px;
  margin: auto;
  margin-bottom: 10px;
  border-radius: 10px;
}
.msg-content {
  background-color: #c5b9b9;
  display: block;
  width: 600px;
  margin: auto;
  overflow: auto;
  height: 400px;
  width: 600px;
  border: 2px solid #208aec;
  border-radius: 10px;
  padding: 10px;
}
.date {
  font-size: 10px;
}
.input {
  position: relative;
}
.upload-icon {
  position: absolute;
  top: 10px;
  right: 0;
  left: 23rem;
  cursor: pointer;
}
.imageUrl {
  width: 280px;
  height: 250px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 10%;
}
.videoUrl {
  width: 280px;
  height: 200px;
}
.fa-upload {
  font-size: 20px;
}
.like {
  font-size: 20px;
  margin-left: 10px;
}
.input_button {
  width: 36rem !important;
  position: relative;
  padding-left: 3rem !important;
}
.upload-like-icon {
  padding: 0 10px;
  font-size: 20px;
}

/* Emogi Icon Start */

.wrapper {
  position: relative;
  display: inline-block;
}

.regular-input {
  padding: 0.5rem 1rem;
  border-radius: 3px;
  border: 1px solid #ccc;
  width: 20rem;
  height: 2rem;
  outline: none;
}

.regular-input:focus {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.emoji-invoker {
  /* position: relative; */
  top: 0.5rem !important ;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 236px !important;
  background: transparent;
  border: 0;
  position: relative;
  left: 8.5rem;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-invoker > svg {
  fill: #b1c6d0;
}

.emoji-picker {
  /* position: relative; */
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
  margin-left: 23rem !important;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: "";
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
/* Emogi Icon End */
.input_icons {
  position: relative;
}
.media {
  display: flex;
  justify-content: center;
}
.media_icon {
  margin: 5px 10px;
}
.loading {
  padding-top: 12rem;
}
.sending_div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fa-microphone,
.fa-microphone-slash {
  padding-left: 18px;
  padding-top: 2px;
}
</style>