<template>
  <div class="h-screen font-bold text-2xl w-full" style="font-family: 'Inter'">
    <div class="flex fixed w-full bg-white">
      <button class="m-auto w-1/5" v-on:click="generateColors(colorQuantity)">
        Generate
      </button>
      <div class="hidden">{{ $route.params }}</div>
    </div>
    <div class="h-full flex">
      <div
        class="h-full w-1/10 absolute flex flex-col justify-around"
        v-bind:class="{ 'opacity-50': activeLeft, 'opacity-0': !activeLeft, 'text-white' : colors[0].colorObject.isLight(), 'text-black' : !colors[0].colorObject.isLight()}"
        v-on:mouseenter="activeLeft = !activeLeft"
        v-on:mouseleave="activeLeft = !activeLeft"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-16 h-16 opacity-50 ml-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div
        v-for="color in colors"
        :key="color.colorCode"
        :locked="color.locked"
        :style="{ width: blockWidth }"
      >
        <color-block
          :color="color"
          :index="colors.indexOf(color)"
          v-on:togglelock="toggleLock"
          v-on:deletecolor="deleteColor"
        ></color-block>
      </div>
      <div
        class="h-full w-1/10 absolute right-0 flex flex-col justify-around mr-4"
        v-bind:class="{ 'opacity-50': activeRight, 'opacity-0': !activeRight }"
        v-on:mouseenter="activeRight = !activeRight"
        v-on:mouseleave="activeRight = !activeRight"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-16 h-16 opacity-50"
          v-bind:class="{'text-white' : colors[colors.length-1].colorObject.isLight(), 'text-black' : !colors[colors.length-1].colorObject.isLight()}"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
var tinycolor = require("tinycolor2");
var namer = require("color-namer");
var router = require("vue-router");
var colorRegex = /^[A-fa-f0-9]{6,60}$/;
export default {
  mounted() {
    console.log("Component mounted.");
    this.color = this.randomColor();
    //this.colors = this.generateColors();
    this.checkParams();
  },
  methods: {
    randomColor() {
      return tinycolor.random().toString("hex");
    },
    generateColors: function (quantity) {
      let path = "";
      for (let i = 0; i < quantity; i++) {
        if (this.colors[i].locked) {
          path =
            path + this.colors[i].colorObject.toString("hex").slice(1) + "-";
        } else {
          path = path + this.randomColor().slice(1) + "-";
        }
      }
      path = path.slice(0, -1);
      this.$router.push(path);
      this.checkParams();
    },
    updateUrl: function () {
      let path = "";
      for (let i = 0; i < this.colors.length; i++) {
        path = path + this.colors[i].colorObject.toString("hex").slice(1) + "-";
      }
      path = path.slice(0, -1);
      this.$router.push(path);
      this.checkParams();
    },
    copyToClipboard: function (string) {
      const el = document.createElement("textarea");
      el.value = string;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    },
    checkParams: function () {
      if (this.$route.params.params) {
        let params = this.$route.params.params.replace(/-/g, "");
        if (
          params.length % 6 == 0 &&
          params.length != 6 &&
          colorRegex.test(params)
        ) {
          this.loadColors(this.$route.params.params.split("-"));
          this.blockWidth = Math.floor(100 / this.colors.length) + 1 + "%";
          this.colorQuantity = this.colors.length;
        }
      }
    },
    loadColors(array) {
      if (array.length != this.colors.length) {
        this.colors = [];
        for (let i = 0; i < array.length; i++) {
          this.colors.push({
            colorObject: new tinycolor(array[i]),
            locked: false,
          });
        }
      } else {
        for (let i = 0; i < array.length; i++) {
          if (this.colors[i].colorObject.toString("hex").slice(1) != array[i]) {
            this.colors[i] = {
              colorObject: new tinycolor(array[i]),
              locked: false,
            };
          }
        }
      }
      console.log(this.colors);
    },
    toggleLock(index) {
      this.colors[index].locked = !this.colors[index].locked;
    },
    deleteColor(index) {
      console.log("delete" + index);
      this.quantity--;
      this.colors.splice(index, 1);
      this.updateUrl();
    },
  },
  data() {
    return {
      colors: [],
      active: false,
      component: "generate",
      blockWidth: "",
      colorQuantity: 0,
      test: 0,
      activeRight: false,
      activeLeft: false,
    };
  },
};
</script>