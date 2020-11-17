<template>
  <div class="h-screen font-bold text-2xl w-full" style="font-family: 'Inter'">
    <div class="flex fixed w-full bg-white">
      <button class="m-auto w-1/5" v-on:click="generateColors()">
        Generate
      </button>
    </div>
    <div class="h-full flex">
      <div
        class="h-full w-1/10 absolute flex flex-col justify-around"
        v-bind:class="{
          'opacity-50': activeLeft,
          'opacity-0': !activeLeft,
          'text-white': !colors[0].colorObject.isLight(),
          'text-black': colors[0].colorObject.isLight(),
        }"
        v-on:mouseenter="activeLeft = !activeLeft"
        v-on:mouseleave="activeLeft = !activeLeft"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-16 h-16 opacity-50 ml-4"
          v-on:click="addColor('beginning')"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <color-block
        v-for="color in colors"
        :key="color.code"
        :locked="color.locked"
        :style="{ width: blockWidth }"
        :color="color"
        :canDelete="canDelete"
        :index="colors.indexOf(color)"
        v-on:togglelock="toggleLock"
        v-on:deletecolor="deleteColor"
      ></color-block>
      <div
        class="h-full w-1/10 absolute right-0 flex flex-col justify-around mr-4"
        v-bind:class="{
          'opacity-50': activeRight,
          'opacity-0': !activeRight,
          'text-white': !colors[colors.length - 1].colorObject.isLight(),
          'text-black': colors[colors.length - 1].colorObject.isLight(),
        }"
        v-on:mouseenter="activeRight = !activeRight"
        v-on:mouseleave="activeRight = !activeRight"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-16 h-16 opacity-50"
          v-on:click="addColor('end')"
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
    this.checkParams();

    console.log(this.colors[0].colorObject.isLight());
    console.log(this.colors[0]);
    console.log(this.colors[this.colors.length - 1].colorObject.isLight());
  },
  methods: {
    randomColor() {
      return tinycolor.random().toString("hex");
    },
    generateColors: function () {
      let path = "";
      for (let i = 0; i < this.colors.length; i++) {
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
      this.loadColors(this.$route.params.params.split("-"));
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
        }
      }
    },
    loadColors(array) {
      console.log(array);
      if (array.length != this.colors.length) {
        this.colors = [];
        for (let i = 0; i < array.length; i++) {
          this.colors.push({
            colorObject: new tinycolor(array[i]),
            locked: false,
            code: array[i],
          });
        }
      } else {
        for (let i = 0; i < array.length; i++) {
          if (this.colors[i].colorObject.toString("hex").slice(1) != array[i]) {
            this.$set(this.colors, i, {
              colorObject: new tinycolor(array[i]),
              locked: false,
              code: array[i],
            });
          }
        }
      }
      this.blockWidth = Math.floor(100 / this.colors.length) + 1 + "%";
      this.colorQuantity = this.colors.length;
    },
    toggleLock(index) {
      //this.colors[index].locked = !this.colors[index].locked;
      let newObject = this.colors[index];
      newObject.locked = !newObject.locked;
      this.$set(this.colors, this.colors.code, newObject);
    },
    deleteColor(index) {
      console.log("delete" + index);
      this.colors.splice(index, 1);
      this.updateUrl();
    },
    addColor(position) {
      console.log("add" + position);
      let newColor = this.randomColor();
      if (position == "end") {
       this.colors.splice(this.colors.length-1,0,{
          colorObject: newColor,
          locked: false,
          code: newColor.toString("hex"),
        });
      } else if (position == "beginning") {
        this.colors.splice(0,0,{
          colorObject: newColor,
          locked: false,
          code: newColor.toString("hex"),
        });
      }
      this.updateUrl();
      console.log(this.colors)
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
      canDelete: true,
    };
  },
};
</script>