<template>
  <q-page class="flex flex-center">
    <h6>waiting for push...</h6>
    <swipeable-bottom-sheet @input="input" ref="swipeableBottomSheet" :type=" defaultLayout ? 'third' : 'complete'" v-model="dialog">
      <div class="swipeable-header row text-center q-pa-lg">
        <slot name="header">
          <div class="row">
            <div class="col-1">
              <q-btn @click="faildLogin" round flat icon="close"/>
            </div>
          </div>
        </slot>
        <div class="col-12" v-if="defaultLayout">
          <div>برای ورود به حساب کاربری دکمه "ورود" را بزنید</div>
          <div class="q-mt-lg q-pt-lg">
            <q-btn class="q-mr-lg" flat @click="faildLogin" label="انصراف" color="primary"/>
            <q-btn unelevated rounded @click="confirmLogin" label="ورود" color="primary"/>
          </div>
        </div>
        <div class="col-12" v-else>
          <div>کد اعتبار سنجی خود را وارد کنید</div>
          <div class="q-mt-md">
            <q-input rounded outlined v-model="userCode"/>
          </div>
          <div class="q-pa-lg">
            <div class="row q-gutter-lg justify-center">
              <div class="col-3">
                <q-btn size="lg" round label="1" @click="userCode += '1'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="2" @click="userCode += '2'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="3" @click="userCode += '3'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="4" @click="userCode += '4'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="5" @click="userCode += '5'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="6" @click="userCode += '6'"/>
              </div>
              <div class="col-3">
                <q-btn round size="lg" label="7" @click="userCode += '7'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="8" @click="userCode += '8'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="9" @click="userCode += '9'"/>
              </div>
              <div class="col-3">
              </div>
              <div class="col-3">
                <q-btn size="lg" round label="0" @click="userCode += '0'"/>
              </div>
              <div class="col-3">
                <q-btn size="lg" color="primary" round icon="check" @click="confirmCode"/>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-5">
              <q-separator class="q-mt-sm"/>
            </div>
            <div class="col-2">یا</div>
            <div class="col-5">
              <q-separator class="q-mt-sm"/>
            </div>
          </div>
          <div class="row q-gutter-sm q-mt-md">
            <div class="col">
              <q-btn class="full-width q-py-sm exter-action" unelevated rounded color="light-blue-2">
                <div class="text-center ">
                  اثر انگشت
                </div>
                <q-icon right name="fingerprint"/>
              </q-btn>
            </div>
            <div class="col">
              <q-btn class="full-width q-py-sm exter-action" unelevated rounded @ color="light-blue-2">
                <div class="text-center">
                  تشخیص چهره
                </div>
                <q-icon right name="border_outer"/>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </swipeable-bottom-sheet>
  </q-page>
</template>

<script>
import SwipeableBottomSheet from '../components/SwipeableBottomSheet'

export default {
  name: 'PageIndex',
  components: {
    SwipeableBottomSheet
  },
  data () {
    return {
      userCode: '',
      dialog: 'close',
      defaultLayout: true
    }
  },
  methods: {
    confirmCode () {
      if (this.userCode === '123456') {
        this.confirmLogin()
      }
    },
    faildLogin () {
      const baseURI = 'http://localhost:3000/send-push-to-web'
      this.$axios.post(baseURI, { result: 'fail' })
      this.dialog = 'close'
      this.checkServer()
    },
    input (data) {
      // if (data === 'close') {
      // this.faildLogin()
      // }
    },
    confirmLogin () {
      const baseURI = 'http://localhost:3000/send-push-to-web'
      this.$axios.post(baseURI, { result: 'confirm' })
      this.dialog = 'close'
      this.checkServer()
    },
    checkServer () {
      const baseURI = 'http://localhost:3000/check-need-login'
      let myinterval = setInterval(() => {
        this.$axios.get(baseURI)
          .then((result) => {
            if (result.data.data.showDialog) {
              this.dialog = 'open'
              if (result.data.data.type === 1) {
                this.defaultLayout = true
              } else {
                this.defaultLayout = false
              }
              clearInterval(myinterval)
            }
          })
      }, 3000)
    }
  },
  mounted () {
    this.checkServer()
  }
}
</script>
<style class="scss">
  .exter-action.q-btn {
    color: #027be3 !important;
  }
</style>
