<template>
  <div class="login">
    <div class="block-wrapper" v-if="showLoader">
      <div  v-if="step==1" class="row align-content-center align-items-center" style="height: 100%">
        <div class="col-12">
          <i class="fa fa-spinner fa-spin mr-1"></i>
        </div>
        <div class="col-12">
          <div>
            جهت اعتبار سنجی توسط موبایل لطفا کمی صبر کنید
          </div>
        </div>
      </div>
      <div  v-if="step==2" class="row align-content-center align-items-center" style="height: 100%">
        <div class="col-12">
          <i  class="fa fa-check"></i>
        </div>
        <div class="col-12">
          <div>
            ورود شما با حامی سیستم با موفقیت انجام شد! برای انتقال به ادامه مراحل لطفا صبر کنید
          </div>
        </div>
      </div>
      <div  v-if="step==3" class="row align-content-center align-items-center" style="height: 100%">
        <div class="col-12">
          <i  class="fa fa-close"></i>
        </div>
        <div class="col-12">
          <div>
            درخواست شما توسط کاربر تایید نشد لطفا مجدد اقدام نمایید
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <createAccount v-if="isSignUp"></createAccount>
        <div class="row">
          <div class="col">
            <form class="form-signin" @submit.prevent="login" v-if="!isSignUp">
              <img class="mb-4" src="../assets/login-img.png" alt width="72" height="72">
              <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
              <label for="email" class="sr-only">Email address</label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="email"
                placeholder="Email address"
                required
                autocomplete="email"
              >
              <label for="password" class="sr-only">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                placeholder="Password"
                required
                autocomplete="current-password"
              >
              <p class="text-muted">
                <a href="javascript:;;">Forget password ?</a>
              </p>
              <button class="btn btn-lg btn-primary btn-block" type="submit">
                <i class="fa fa-spinner fa-spin mr-1" v-if="showLoader"></i> Log In
              </button>
            </form>
            <p class="mt-3 text-muted">
               <span v-if="isSignUp">
                  Already a member?
                  <a href="javascript:;;" @click="toggleForm">Sign in</a>
               </span>
              <span v-if="!isSignUp">
                      New to shop.com?
                   <a href="javascript:;;" @click="toggleForm">Create an Account</a>
              </span>
            </p>
          </div>
          <div class="col sel align-self-end mb-5">
            <form class="form-signin"  v-if="!isSignUp">
              <h5 class="mb-3 font-weight-normal">با استفاده از حامی کانکت وارد حساب کاربری خود شوید و خرید آسانی را تجربه کنید</h5>
              <label for="email" class="sr-only">شماره موبایل(حامی کانکت)</label>
              <div class="input-group mb-3 mt-5">
                <input
                  type="text"
                  id="mobile"
                  class="form-control"
                  v-model="mobile"
                  placeholder="شماره موبایل"
                  required
                  autocomplete="mobile"
                >
                <div class="input-group-append">
                  <button  @click="LoginWithHami" class="btn btn-lg btn-primary">
                    type 1 >
                  </button>
                  <button @click="LoginWithHami2"  class="btn btn-lg btn-secondary">
                    type 2 >
                  </button>

                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CreateAccount from '@/components/CreateAccount'
import axios from 'axios'
import {
  errorToaster
} from '../components/shared/service/ErrorHandler.js'

import { mapMutations } from 'vuex'

export default {
  name: 'login',
  components: { CreateAccount },
  data () {
    return {
      email: '',
      password: '',
      showLoader: false,
      isSignUp: false,
      mobile: '',
      step: 0
    }
  },
  methods: {
    toggleForm () {
      this.isSignUp = !this.isSignUp
    },
    ...mapMutations(['ADD_LOGGED_USER']),
    LoginWithHami2 () {
      this.step = 1
      this.showLoader = true
      const baseURI = 'http://localhost:3000/send-push-to-mobile-type2'
      axios.post(baseURI)
        .then((result) => {
          const baseURI2 = 'http://localhost:3000/check-need-confirm'
          let myinterval = setInterval(() => {
            axios.get(baseURI2)
              .then((result) => {
                if (result.data.data) {
                  if (result.data.data.result === 'confirm') {
                    this.step = 2
                    const sampleData={
                      createdOn: "11/11/2019, 5:15:20 AM",
                      email: "a@gmail.com",
                      firstName: "HamiSystem",
                      fullName: "564678 56465432",
                      isAdmin: false,
                      lastName: "56465432",
                      password: "123456",
                    }
                    this.ADD_LOGGED_USER(sampleData)
                    setTimeout(() => {
                      this.$router.push(this.$route.query.from || '/')
                    }, 1000)
                  } else {
                    this.showLoader = false
                    this.step = 0
                  }
                  clearInterval(myinterval)
                }
              })
          }, 3000)
        })
    },
    LoginWithHami () {
      this.step = 1
      this.showLoader = true
      const baseURI = 'http://localhost:3000/send-push-to-mobile'
      axios.post(baseURI)
        .then((result) => {
          const baseURI2 = 'http://localhost:3000/check-need-confirm'
          let myinterval = setInterval(() => {
            axios.get(baseURI2)
              .then((result) => {
                if (result.data.data) {
                  if (result.data.data.result === 'confirm') {
                    this.step = 2
                    setTimeout(() => {
                      const sampleData={
                        createdOn: "11/11/2019, 5:15:20 AM",
                        email: "a@gmail.com",
                        firstName: "HamiSystem",
                        fullName: "564678 56465432",
                        isAdmin: false,
                        lastName: "56465432",
                        password: "123456",
                      }
                      this.ADD_LOGGED_USER(sampleData)
                      this.$router.push(this.$route.query.from || '/')
                    }, 3000)
                  } else {
                    this.step = 3
                    setTimeout(() => {
                      this.showLoader = false
                      this.step = 0
                    }, 1000)
                  }
                  clearInterval(myinterval)
                }
              })
          }, 3000)
        })
    },
    login (event) {
      this.showLoader = true
      const user = {
        email: this.email,
        password: this.password
      }

      axios
        .post(`${process.env.VUE_APP_BASE_URL}/login`, user)
        .then(response => {
          this.showLoader = false
          this.ADD_LOGGED_USER(response.data[0])
          event.target.reset()
          this.$router.push(this.$route.query.from || '/')
        })
        .catch(error => {
          this.showLoader = false
          errorToaster('Invalid Credentials', '')
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss">
  .login {
    position:      relative;
    top:           50px;
    margin-bottom: 15%;
  }

  .block-wrapper {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background: #00000080;
    z-index: 1000;
    color: #f2f2f2;
    i{
      font-size: 100px;
    }
  }

  .form-signin {
    width:   100%;
    padding: 15px;
    margin:  auto;
  }

  .form-signin .checkbox {
    font-weight: 400;
  }

  .form-signin .form-control {
    position:   relative;
    box-sizing: border-box;
    height:     auto;
    padding:    10px;
    font-size:  16px;
  }

  .form-signin .form-control:focus {
    z-index: 2;
  }

  .form-signin input[type="email"] {
    margin-bottom:              -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius:  0;
  }

  .form-signin input[type="password"] {
    margin-bottom:           10px;
    border-top-left-radius:  0;
    border-top-right-radius: 0;
  }
</style>
