<template>
  <div class="h-screen font-bold text-2xl w-full" style="font-family: 'Inter'">
    <div class="flex fixed w-full bg-white">
      <button class="m-auto w-1/5" v-on:click="generateColors(colorQuantity)">
        Generaasdsadsaste{{ $route.params }}
      </button>
    </div>
    <div class="h-full flex color">
        <div 
        v-for="colorHex in colors"
        :key="colorHex"
        :style="{'width': blockWidth}">
          <color-block :color='colorHex'></color-block>
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
      console.log(quantity)
      let path = "";
      for(let i = 0; i < quantity; i++){
        path = path + this.randomColor().slice(1) + "-";
      }
      path = path.slice(0,-1);
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
        if (params.length % 6 == 0 && params.length != 6) {
          if (colorRegex.test(params)) {
              this.colors = [];
            for (let i = 0; i < params.length / 6; i++) {
              this.colors.push(params.slice(i * 6, (i + 1) * 6));
              console.log(this.colors);
            }
            this.blockWidth = Math.floor(100 / this.colors.length) + 1 + "%";
            this.colorQuantity = this.colors.length;
          }
        }
        else if(params.length == 6 && colorRegex.test(params)){
          this.component = "color";
        }
        else {
          this.component = "error"
        }
      }
      console.log(this.component)
    },
  },
  data() {
    return {
      color: "",
      colors: [],
      namer: require("color-namer"),
      active: false,
      component: "generate",
      blockWidth: "",
      colorQuantity: 0 
    };
  },
  watch: {
    colors: {
      handler(newValue, oldValue) {},
      deep: true,
    },
  },
};
</script>