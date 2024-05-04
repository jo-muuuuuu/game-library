const items = document.querySelectorAll(".item");

// window.scrollY : 视口顶端距离页面顶端的距离（绝对）
// element.offsetTop : 元素距离页面顶端的距离（绝对）
// element.getBoundingClientRect().top : 元素距离视口顶端的距离（相对）

window.addEventListener("scroll", () => {
  var windowHeight = window.innerHeight;
  var closestItem = null;

  items.forEach((item) => {
    item.classList.remove("hidden-text");
    item.querySelector("img").classList.remove("highlight");
    item.querySelector("img").classList.remove("visible");
    item.querySelector(".content-title").classList.remove("visible");

    let itemRectTop = item.getBoundingClientRect().top;
    if (itemRectTop >= 0 && itemRectTop < windowHeight / 2) {
      closestItem = item;
    }
  });

  closestItem.classList.add("hidden-text");
  closestItem.querySelector("img").classList.add("highlight");
  closestItem.querySelector("img").classList.add("visible");

  closestItem.querySelector(".content-title").classList.add("visible");
});

