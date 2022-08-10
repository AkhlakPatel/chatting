<template>
  <div>
    <button type="button" id="record">Record</button><br>
    <button type="button" id="stopRecord" disabled>Stop</button><br>
     <p>
    <audio id=recordedAudio></audio>        
  </p>
  </div>
</template>
<script>
export default {
  name: "VoiceRecord",
  data(){
    return {
        recordedVoice:""
    }
  },
  methods: {
    
  },
};
</script>