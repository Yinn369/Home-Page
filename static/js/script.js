// 禁用右键菜单
document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

// 项目卡片按压效果
function handlePress(event) {
  this.classList.add("pressed");
}
function handleRelease(event) {
  this.classList.remove("pressed");
}
function handleCancel(event) {
  this.classList.remove("pressed");
}
var buttons = document.querySelectorAll(".projectItem");
buttons.forEach(function (button) {
  button.addEventListener("mousedown", handlePress);
  button.addEventListener("mouseup", handleRelease);
  button.addEventListener("mouseleave", handleCancel);
  button.addEventListener("touchstart", handlePress);
  button.addEventListener("touchend", handleRelease);
  button.addEventListener("touchcancel", handleCancel);
});

// 切换弹窗显示/隐藏
function toggleClass(selector, className) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.classList.toggle(className);
  });
}

// 弹窗图片展示
function pop(imageURL) {
  var tcMainElement = document.querySelector(".tc-img");
  if (imageURL) {
    tcMainElement.src = imageURL;
  }
  toggleClass(".tc-main", "active");
  toggleClass(".tc", "active");
}
var tc = document.getElementsByClassName("tc");
var tc_main = document.getElementsByClassName("tc-main");
tc[0].addEventListener("click", function (event) {
  pop();
});
tc_main[0].addEventListener("click", function (event) {
  event.stopPropagation();
});

// Cookie操作
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) == 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

// 时间与日期实时更新
function updateWelcomeTime() {
  var timeElem = document.querySelector(".welcome .time");
  var dateElem = document.querySelector(".welcome .datetime span:not(.time)");
  if (!timeElem || !dateElem) return;

  var now = new Date();
  var h = String(now.getHours()).padStart(2, "0");
  var m = String(now.getMinutes()).padStart(2, "0");
  var s = String(now.getSeconds()).padStart(2, "0");
  timeElem.textContent = h + ":" + m + ":" + s;

  var month = now.getMonth() + 1;
  var day = now.getDate();
  var weekArr = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  var week = weekArr[now.getDay()];
  dateElem.innerHTML = `<i>${month}-${day}</i> <i>${week}</i>`;
}
setInterval(updateWelcomeTime, 1000);
updateWelcomeTime();

// 页面加载动画淡出
var pageLoading = document.querySelector("#yinx-loading");
window.addEventListener("load", function () {
  setTimeout(function () {
    pageLoading.style.opacity = "0";
  }, 100);
});

var pageLoading = document.querySelector("#yinx-loading");
window.addEventListener("load", function () {
  setTimeout(function () {
    pageLoading.style.opacity = "0";
  }, 100);
});
