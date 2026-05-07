<template>
  <div class="title">
    <img
      class="icon"
      src="./imgs/383a4f5d-e07d-4809-8cb6-c8743549e307.png"
      alt=""
    />
    <span class="text">
      <slot></slot>
    </span>
    <img
      class="line"
      src="./imgs//e20bb50f-6e39-4241-9b46-7f22f416ec21.png"
      alt=""
    />
  </div>
</template>

<style lang="scss" scoped>
.title {
  position: relative;
  margin-bottom: 10px;
  .icon {
    width: 36px;
    height: 34px;
  }
  .text {
    font-size: 25px;
    font-weight: 700;
    font-family: var(--font-family-body);
    text-align: left;
    line-height: 60px;
    font-style: normal;
    letter-spacing: 2px;
    background-image: linear-gradient(
      rgb(255, 255, 255),
      rgb(210, 244, 252),
      rgb(89, 181, 218)
    );
    color: transparent;
    background-clip: text;
    margin-left: -5px;
    margin-right: 10px;
  }
  .line {
    width: 531px;
    height: 11px;
  }
}
</style>
