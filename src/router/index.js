import Vue from 'vue'
import VueRouter from 'vue-router'
import Chat from '../ChatSetup.vue'
import Emogi from '../Emogi.vue'
import Test from '../Test.vue'
import voiceRecord from '../components/VoiceRecord.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'chat',
    component: Chat
  },
  {
    path: '/emogi',
    name: 'Emogi',
    component:Emogi
  },
  {
    path: '/test',
    name: 'Test',
    component:Test
  },
  {
    path: '/voice',
    name: 'voiceRecord',
    component:voiceRecord
  },
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
