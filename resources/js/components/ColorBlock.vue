<template>
  <div
    class="h-full flex flex-col items-center justify-around"
    v-bind:class="{ 'text-white': !isLight }"
    :style="{ 'background-color': color.colorObject.toString('hex') }"
    v-on:mouseenter="active = !active"
    v-on:mouseleave="active = !active"
    draggable="true"
  >
    <div
      class="m-auto my-2 opacity-0"
      v-bind:class="{ 'opacity-50': active, 'opacity-0': !active }"
    >
      <svg
        class="h-6 w-6 m-auto my-3"
        v-bind:class="{
          'hover:text-white': isLight,
          'hover:text-black': !isLight,
        }"
        @click="deleteColor"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>

      <svg
        class="h-6 w-6 m-auto my-3"
        v-on:click="copyToClipboard(color.colorObject.toHexString())"
        v-bind:class="{
          'hover:text-white': isLight,
          'hover:text-black': !isLight,
        }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      <svg
        class="h-6 w-6 m-auto my-3"
        v-bind:class="{
          'hover:text-white': isLight,
          'hover:text-black': !isLight,
        }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      <svg
        class="h-6 w-6 m-auto my-3"
        v-bind:class="{
          'hover:text-white': isLight,
          'hover:text-black': !isLight,
        }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
      <svg
        v-if="color.locked"
        class="h-6 w-6 m-auto my-3 opacity-100"
        v-bind:class="{
          'hover:text-white': isLight,
          'hover:text-black': !isLight,
        }"
        @click="toggleLock"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <svg
        v-if="!color.locked"
        class="h-6 w-6 m-auto my-3"
        v-bind:class="{
          'hover:text-white': isLight,
          'hover:text-black': !isLight,
          'opacity-100': color.locked,
        }"
        @click="toggleLock"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
        />
      </svg>
      {{ color.locked }}
    </div>
    <div>
      <div class="text-center my-2">
        {{ color.colorObject.toHexString().toUpperCase() }}
      </div>
      <div class="text-center text-sm font-normal my-2">
        {{
          namer(color.colorObject.toString(), { pick: ["ntc"] })[
            "ntc"
          ][0].name.toUpperCase()
        }}
      </div>
    </div>
  </div>
</template>
<script>
var tinycolor = require("tinycolor2");
var namer = require("color-namer");

import VueToastr from "@deveodk/vue-toastr";
import "@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css";
export default {
  mounted() {
    console.log("Component mounted.");
    this.isLight = this.color.colorObject.isLight();
  },
  props: ["color", "index"],
  data() {
    return {
      colorObject: "",
      isLight: "",
      namer: require("color-namer"),
      active: false,
    };
  },
  methods: {
    copyToClipboard: function (string) {
      const el = document.createElement("textarea");
      el.value = string;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      this.showToastr();
    },
    showToastr: function () {
      this.$toastr("add", "Copied to clipboard!");
    },
    toggleLock() {
      this.$emit("togglelock", this.index);
    },
    deleteColor() {
      this.$emit("deletecolor", this.index);
    },
  },
};
</script>