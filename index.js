// window.scrollY : 视口顶端距离页面顶端的距离（绝对）
// element.offsetTop : 元素距离页面顶端的距离（绝对）
// element.getBoundingClientRect().top : 元素距离视口顶端的距离（相对）

const items = document.querySelectorAll(".item");

// 设置背景图片的函数
function setBackgroundImage(imageUrl) {
  document.body.style.backgroundImage = `url('${imageUrl}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

window.addEventListener("scroll", function () {
  var windowHeight = window.innerHeight;
  var closestItem = null;

  items.forEach((item) => {
    if (item.classList) {
      item.classList.remove("hidden-text");
    }
    item.querySelector("img").classList.remove("highlight");
    item.querySelector("img").classList.remove("visible");
    item.querySelector(".content-title").classList.remove("visible");

    let itemRectTop = item.getBoundingClientRect().top;
    if (itemRectTop >= 0 && itemRectTop < windowHeight / 2) {
      closestItem = item;

      const img = closestItem.querySelector("img");
      setBackgroundImage(img.src);
    }
  });

  closestItem.classList.add("hidden-text");
  closestItem.querySelector("img").classList.add("highlight");
  closestItem.querySelector("img").classList.add("visible");

  closestItem.querySelector(".content-title").classList.add("visible");
});

const readMe = document.getElementById("readme");
readMe.onclick = function () {
  Swal.fire({
    icon: "info",
    width: "800px",
    html: `
          <style>
              * { 
                  font-size: 16px;
              }
          </style>

           <h1 style="font-size:20px"> About this website: </h1>  
           <br /> The purpose of creating this website is twofold: <br />
           <br /> 1. Due to my passion for gaming. <br />
           <br /> 2.To demonstrate that I am familiar with the fundamentals. <br />
           <b> (However, more importantly: I am open to learning and using new techniques/frameworks/languages.) </b> <br />

           <br /> All elements and styles are coded by hand, <br />
           i.e. <b> no CSS frameworks like Tailwind or Bootstrap used</b>. <br />
           <br /> Except for the "Alert" windows
           (which are much better than the default one, isn't it?), <br />
           everything else is implemented with <b>Vanilla JavaScript</b>. <br />
           
           <br /> <hr /> <br />
           <h1 style="font-size:20px"> About the games:  </h1> <br />
           Games with a star mark (*) following their names indicate that the <b>Platinum Trophy</b> has been obtained. <br />
           <br /> Sadly, games with a dash (-) means I gave up in the middle way.`,
  });
};

const log = document.getElementById("log");
log.onclick = function () {
  Swal.fire({
    width: "800px",
    html: `
          <style>
              * { 
                  font-size: 20px;
              }
          </style>

          <br /><br />
          <b>May 2024 - </b> I started my journey in <b>Goat Simulator III</b>. <br />
          <br /> <img src="./img/goat.jpeg" width=240px/>`,
  });
};

const msgBtn = document.querySelector(".msg-button");
msgBtn.onclick = function () {
  Swal.fire({
    width: "800px",
    title: "Sorry",
    text: `Due to the limitations of the hosting platform and 
           my preference for using only Vanilla JavaScript, this functionality is not supported. 
           I would really appreciate it if you could provide some feedback by email.`,
  });

  document.querySelector(".msg-button").style.display = "none";

  document.querySelector(".footer").style.height = 700 + "px";

  document.querySelector("#for-form").innerHTML = `
    <h2>Leave A Message</h2>

    <form id="msg-form">
      <label class="form-label" for="name">Name</label>
      <input
        class="form-input"
        type="text"
        id="name"
        name="name"
        placeholder="Anonymous"
      />
      <br />

      <label class="form-label" for="name">Email</label>
      <input
        class="form-input"
        type="text"
        id="email"
        name="email"
        placeholder="Anonymous"
      />
      <br />

      <label class="form-label" for="content">*Content</label>
      <textarea id="content" name="content" cols="50" rows="10"></textarea>
      <br />

      <button class="submit-button" type="button">SUBMIT _</button>
    </form>
  `;

  document
    .querySelector(".submit-button")
    .addEventListener("click", function () {
      var content = document.getElementById("content").value;
      if (content) {
        Swal.fire({
          width: "800px",
          title: "Content Submitted",
          text: "Thanks for your feedback",
        });
      } else {
        Swal.fire({
          width: "800px",
          title: "Failed to Submit",
          text: "Sorry, the content field is empty.",
        });
      }
    });
};
