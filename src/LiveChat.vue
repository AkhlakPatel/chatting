<template>
  <div>
    <h2>Live chat</h2>
    <div>
      <div class="">
        <h2 class="text-center">
          {{ senderNicknameInput }} sending, {{ receiverNicknameInput }}
          receiving!
        </h2>
      </div>
      <div class="msg-content">
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
            <!-- </div> -->

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
      </div>
      <div class="new_message">
        <h2 class="new_message_title">New message</h2>
        <div class="input">
          <input
            class="input_button form_input"
            placeholder="Your message..."
            v-model="messageInput"
            @keyup.enter="sendmsg"
          />
          <div class="upload-icon">
            <input
              type="file"
              id="upload-file"
              style="display: none"
              ref="fileInput"
              @input="onSelectFile"
              accept="image/png, image/gif, image/jpeg"
               @keyup.enter="sendmsg"
            />
            <div class="input_icons">
              <label
                for="upload-file"
                class="fa-solid fa-upload upload-like-icon"
                @click="uploadFile"
              ></label>
              <i class="fa-solid fa-thumbs-up " @click="handleLike"></i>
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
      image: "",
      like: false,
      search: "", // for Icon/Emogi search
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
        // this.getPhoto();
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
          Message.set("text", messageText);
          Message.set("type", 0);
          Message.set("sender", senderNicknameObject);
          Message.set("receiver", receiverNicknameObject);
          Message.save();
          // Clear input
          this.messageInput = "";
        }

        // Handle iamge for send file
        else if (this.image !== "") {
          const base64 = this.image;
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
          if (res) console.log("Success", res);
          // this.getPhoto();
        } else if (this.like == true) {
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

    // function for handle upload file
    uploadFile() {
      this.$refs.fileInput.click();
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
          console.log(this.image);
          //      console.log(this.image.substring(
          //   "data:".length,
          //   this.image.indexOf(";base64")
          //  ));
        };
        reader.readAsDataURL(files[0]);
        this.$emit("input", files[0]);
      }
    },
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
    // async getPhoto() {
    //   const parseQuery = new Parse.Query("Message");

    //   // get messages that involve both nicknames
    //   parseQuery.containedIn("sender", [
    //     this.senderNicknameId,
    //     this.receiverNicknameId,
    //   ]); // AP & Bp

    //   parseQuery.containedIn("receiver", [
    //     this.senderNicknameId,
    //     this.receiverNicknameId,
    //   ]);

    //   // Set result ordering
    //   parseQuery.ascending("createdAt");

    //   // parseQuery.includeAll();
    //   parseQuery.exists("imageUrl");
    //   let res = await parseQuery.find();
    //   // let imageUrl = [];
    //   for (let i = 0; i < res.length; i++) {
    //     let obj = res[i];
    //     this.result.push({
    //       objectId: obj.get("objectId"),
    //       // createdAt: obj.get("createdAt"),
    //       sender: obj.get("sender"),
    //       receiver: obj.get("receiver"),
    //       imageUrl: obj.get("mediaUrl"),
    //     });
    //   }
    //   // this.imageUrl = imageUrl;
    //   // this.result.push(imageUrl);
    //   console.log(this.result);
    //   // console.log(imageUrl);
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
}

.name {
  float: right;
  color: rgb(121, 117, 117);
}

.content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.msg-left {
  float: left;
  background-color: #8995a1;
  width: 300px;
  margin: auto;
  margin-bottom: 10px;
  display: block;
}
.msg-right {
  display: block;
  float: right;
  background-color: #208aec;
  width: 300px;
  margin: auto;
  margin-bottom: 10px;
}
.msg-content {
  background-color: #d8d8d8;
  display: block;
  width: 600px;
  margin: auto;
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
  width: 300px;
  height: auto;
  background-position: center;
  background-repeat: no-repeat;
}
.fa-upload {
  font-size: 20px;
}
.fa-thumbs-up {
  margin-left: 10px;
  font-size: 20px;
}
.input_button {
  width: 36rem !important;
  position: relative;
  padding-left: 3rem !important;
}
.upload-like-icon {
  padding:0 10px;
  margin-left: 75px;
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
  padding: 0;
  background: transparent;
  border: 0;
  position: relative;
  left: 23.5rem;
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
</style>