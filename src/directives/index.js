import { insertSeparator } from "@/libs/util";
import { getNationalPng } from "@/libs/country";

export default function createDirectives(app) {
  app.directive("thousand", {
    mounted(el) {
      el.textContent = insertSeparator(el.textContent);
    },
  });
  app.directive("flag", {
    mounted(el, binding) {
      setNationalFlagImg(el, binding);
    },
    updated(el, binding) {
      const children = el.children;
      children[0] && el.removeChild(children[0]);
      setNationalFlagImg(el, binding);
    },
  });
  app.directive("fmt", {
    mounted(el) {
      formatNumber(el);
    },
    updated(el) {
      formatNumber(el);
    },
  });
}

function setNationalFlagImg(el, binding) {
  const nationName = el.textContent.trim();
  const url = setNationalFlag(nationName);
  if (url) {
    const img = document.createElement("img");
    img.src = url;
    if (binding.value?.style) {
      img.style = binding.value.style;
      img.style.verticalAlign = "middle";
    } else {
      img.style = "width:18px;margin-right:5px;vertical-align:middle;";
    }
    el.style.display = "inline-flex";
    el.style.alignItems = "center";
    if (binding.value?.hiddenText) {
      el.textContent = "";
    }
    el.prepend(img);
  }
}

function setNationalFlag(str) {
  const flag = getNationalPng(str);
  if (flag) {
    return require(`/public/countryFlag/${flag}.png`);
  }
  return "";
}

function formatNumber(el) {
  const num = Number(el.textContent);
  if (isNaN(num)) return;

  if (num >= 10000) {
    el.textContent = (num / 10000).toFixed(1) + "万";
  } else {
    el.textContent = insertSeparator(num.toString());
  }
}
