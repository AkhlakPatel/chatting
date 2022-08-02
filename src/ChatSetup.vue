<template>
    <div>
        <div>
            <div class="header">
                <h1 class="header_text">Chatting App with Back4App</h1>
            </div>
            <div class="container">
                <div v-if="senderNicknameId === '' && receiverNicknameId === ''">
                    <!-- <div> -->
                    <br />
                    <input type="text" class="form_input" placeholder="Sender (your) Nickname"
                        v-model="senderNicknameInput" />
                    <br /><br />
                    <input class="form_input" v-model="receiverNicknameInput" placeholder="Receiver (Their) Nickname" />
                    <br />
                    <br />
                    <Button type="primary" class="form_button" @click="liveChat">
                        Start live chat
                    </Button>
                </div>
            </div>
        </div>
        <div v-if="senderNicknameId !== '' && receiverNicknameId !== ''">
            <!-- <div > -->
            <live-chat 
             :senderNicknameInput='senderNicknameInput'
             :senderNicknameId="senderNicknameId"
             :receiverNicknameInput="receiverNicknameInput" 
             :receiverNicknameId="receiverNicknameId" />
        </div>
    </div>
</template>
<script>
const Parse = require("parse");
Parse.initialize(
    "7jOylnKjNew2fhToxAJRtu5Of4by6H49HXmFZ14b",
    "uIvl4BATgFbKfM3Euf6B8YRnobYWjmcY3N2N2YBJ"
);
// Parse.serverURL = "https://parseapi.back4app.com";
Parse.serverURL = "https://testlivechat.b4a.io";


import LiveChat from './LiveChat.vue';
export default {
    components: { LiveChat },
    name: "ChatSetup",
    data() {
        return {
            senderNicknameInput: "",
            senderNicknameId: "",
            receiverNicknameInput: "",
            receiverNicknameId: "",
        };
    },
    methods: {
        async liveChat() {
            const senderNicknameName = this.senderNicknameInput;
            const receiverNicknameName = this.receiverNicknameInput;

            // check if user informed both nicknames
            if (
                senderNicknameName === null ||
                receiverNicknameName === null ||
                senderNicknameName === undefined ||
                receiverNicknameName === undefined ||
                senderNicknameName === "" ||
                receiverNicknameName === ""
            ) {
                alert("please inform both sender and receiver nickname!");
                return false;
            }

            // check if sender nickname already exists. if not create new parse object.
            let senderNicknameObject = null;
            try {
                const senderParseQuery = new Parse.Query("Nickname");
                senderParseQuery.equalTo("name", senderNicknameName);
                const senderParseQueryResult = await senderParseQuery.first();
                if (
                    senderParseQueryResult !== undefined &&
                    senderParseQueryResult !== null
                ) {
                    senderNicknameObject = senderParseQueryResult;
                    // console.log('Sender found')
                    this.senderNicknameId = senderNicknameObject.id
                } else {
                    // console.log("Sender not found");
                    senderNicknameObject = new Parse.Object("Nickname");
                    senderNicknameObject.set("name", senderNicknameName);
                    senderNicknameObject = await senderNicknameObject.save();
                    this.senderNicknameId = senderNicknameObject.id
                }
            } catch (error) {
                alert(error);
                return false;
            }

            // Check if receiver nickname already exist , if not create new parse object
            let receiverNicknameObject = null;
            try {
                const receiverParseQuery = new Parse.Query("Nickname");
                receiverParseQuery.equalTo("name", receiverNicknameName);
                const receiverParseQueryResult = await receiverParseQuery.first();
                if (
                    receiverParseQueryResult !== undefined &&
                    receiverParseQueryResult !== null
                ) {
                    receiverNicknameObject = receiverParseQueryResult;
                    // console.log(receiverNicknameObject.id)
                    // console.log('Receiver found')
                    this.receiverNicknameId = receiverNicknameObject.id
                } else {
                    receiverNicknameObject = new Parse.Object("Nickname");
                    receiverNicknameObject.set("name", receiverNicknameName);
                    receiverNicknameObject = await receiverNicknameObject.save();
                    console.log(receiverNicknameObject)
                    // console.log("Receiver not found");
                    this.receiverNicknameId = receiverNicknameObject.id
                    // console.log(this.receiverNicknameId)
                }
            } catch (error) {
                alert(error);
                return false;
            }

            // Set nickname object IDs, so live chat componert is instantiated

            // this.senderNicknameId = senderNicknameObject.id,
            // this.receiverNicknameId = receiverNicknameObject.id,

        }
    },

};
</script>

<style>
.header_text {
    font-size: 50px;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.form_input,
.form_button {
    padding: 10px;
    width: 25rem;
    border: 2px solid #208aec;
}

.form_button {
    background-color: #208aec;
    color: white;
    cursor: pointer;
}
</style>