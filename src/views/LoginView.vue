<template>
  <div class="login">
    <div class="login-box">
      <div class="left">
        <div
          class="username"
          id="123"
        >
         <CustomInput :placeholder="'Username'" />
        </div>
        <div class="password"></div>
      </div>
      <div class="right">
        <img ref="picture" class="picture" :src="BodyWeightingImg" alt=""/>
        <div ref="slogan" class="slogan">Start Record Yourself Today!</div>
        <!-- <a href="http://www.freepik.com">Designed by vectorjuice / Freepik</a> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BodyWeightingImg from '@/assets/bodyWeighting2.png';
import gsap from 'gsap';
import CustomInput from '@/components/CustomInput.vue';

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      BodyWeightingImg,
    };
  },
  mounted() {
    this.initAnimation();
  },
  methods: {
    initAnimation() {
      const timeLine = gsap.timeline();
      timeLine.from(this.$refs.picture as gsap.TweenTarget, {
        y: '-75vh',
        ease: 'bounce',
        duration: 1,
      });
      timeLine.from(this.$refs.slogan as gsap.TweenTarget, {
        opacity: 0,
        ease: 'power3',
      });
    },
  },
  components: { CustomInput },
});
</script>

<style lang="scss" scoped>
@use "sass:map";

@import "@/style/colors.scss";

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-blend-mode: screen;
  .login-box {
    $border-radius: 12px;
    display: flex;
    flex-direction: row;
    height: 700px;
    width: 80vw;
    border-radius: $border-radius;
    box-shadow: 0px 0px 20px -3px map-get($map: $blue, $key: "200");
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 100%;
      background-color: white;
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
      .username {
        position: relative;
        width: 500px;
        height: 35px;
        // border-bottom: 1px solid map-get($map: $blue, $key: "700");
        .input {
          width: 100%;
          height: 100%;
          outline: none;
          font-size: 24px;
          padding-left: 10px;
          padding-right: 10px;
          border: none;
          border-bottom: 1px solid map-get($map: $blue, $key: "700");
        }
        .placeholder {
          position: absolute;
          font-size: 24px;
          color: map-get($map: $black, $key: "500");
          transform: translateY(0);
          top: 0;
          left: 10px;
          transition: transform 0.1s ease-in-out,
            font-size 0.1s ease-in-out,
            color 0.1s ease-in-out;
          cursor: text;
          pointer-events: none;
          &.focus {
              transform: translate(0, -20px);
              font-size: 16px;
              color: map-get($map: $blue, $key: "500");
          }
        }
      }
      .password {

      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 100%;
      background-color: map-get($map: $blue, $key: "700");
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      row-gap: 30px;
      .slogan {
        color: white;
        font-size: 26px;
      }
      .picture {
        width: 25vw;
        height: 25vw;
      }
    }
  }
}
</style>
