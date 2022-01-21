const accountname = localStorage.getItem("accountname");
const authorAccount = localStorage.getItem("authorAccoutName")
const token = localStorage.getItem("Token");
async function getProfile() {
  const url = `http://146.56.183.55:5050/profile/${authorAccount}`;
  const token = localStorage.getItem("Token");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  const 이미지 = json.profile.image;
  const 이름 = json.profile.username;
  const 계정 = json.profile.accountname;
  const 소개 = json.profile.intro;
  const 팔로워수 = json.profile.followerCount;
  const 팔로잉수 = json.profile.followingCount;

  document.querySelector(".profile").innerHTML += `
  <a href="" class="display-inline basic-profile"><img src="${이미지}" alt=""></a>
  <div class="profile-desc">
  <h2>${이름}</h2>
  <small>@ ${계정}</small>
  <p>${소개}</p>
  </div>
  <div class="btn-set">
        <button type="submit" class="display-inline icon-massage"><img src="img/message.png" alt=""></button>
        <button type="submit" class="display-inline follow-btn">팔로우</button>
        <button type="submit" class="display-inline icon-share"><img src="img/icon-share.png" alt=""></button>
  </div>
    `;

  document.querySelector(".followers-num").innerHTML += `
    <p class="followBtn">${팔로워수}</p>
    <small>followers</small>
  `;

  document.querySelector(".followings-num").innerHTML += `
  <p class="followingBtn">${팔로잉수}</p>
  <small>followeings</small>
`;

  const 팔로워 = document.querySelector(".followBtn");
  const 팔로잉 = document.querySelector(".followingBtn");

  팔로워.addEventListener("click", function () {
    location.href = "./followerlist.html";
  });
  팔로잉.addEventListener("click", function () {
    location.href = "./followinglist.html";
  });
}

getProfile();

const sellDiv = document.querySelector(".sell-items");
// 판매 게시글 가져오기
async function GetSaleInfo() {
  const saleimgdata = await fetch(
    `http://146.56.183.55:5050/product/${authorAccount}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const salejson = await saleimgdata.json();
  const sale_pro = salejson.product;
  console.log(salejson);
  sale_pro.forEach((el) => {
    const itemName = el.itemName;
    const itemImg = el.itemImage;
    const itemLink = el.link;
    const itemPrice = el.price;
    let sellArt = document.createElement("article");
    sellArt.classList.add("display-sell");
    sellArt.innerHTML = `
      <a href="${itemLink}">
        <img src="${itemImg}" alt="">
        <p>${itemName}</p>
        <small>${itemPrice}원</small>
      </a>
    `;
    sellDiv.appendChild(sellArt);
  });
}

// 피드 보여주는 버튼 부분
const albumBtn = document.querySelector(".show-album img");
const listBtn = document.querySelector(".show-list img");
const albumSec = document.querySelector(".album");
const listSec = document.querySelector(".home-feed");
window.onload = function () {
  // load();
  GetSaleInfo();
  albumSec.classList.add("hide");
  GetList();
  GetAlbum();
};
// async function load(){
//   GetSaleInfo();
//   albumSec.classList.add("hide");
//   GetList();
//   GetAlbum();
// }

albumBtn.addEventListener("click", () => {
  albumBtn.src = "./img/icon-post-album-on.png";
  listBtn.src = "./img/icon-post-list-off.png";
  listSec.classList.add("hide");
  albumSec.classList.remove("hide");
});

listBtn.addEventListener("click", () => {
  albumBtn.src = "./img/icon-post-album-off.png";
  listBtn.src = "./img/icon-post-list-on.png";
  albumSec.classList.add("hide");
  listSec.classList.remove("hide");
});

// 피드 가져오기 리스트형식
async function GetList() {
  const feedimgdata = await fetch(
    `http://146.56.183.55:5050/post/${authorAccount}/userpost`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const list = await feedimgdata.json();
  const listPost = list.post;
  listPost.forEach((el) => {
    const username = el.author.username;
    const userImg = el.author.image;
    const accountname = el.author.accountname;
    const content = el.content;
    const feedImg = el.image;
    let updateAt = el.updatedAt;
    // updateAt = updateAt.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g);
    const year = updateAt.slice(0, 4);
    const month = updateAt.slice(5, 6)+1;
    const date = updateAt.slice(8, 10);

    let heartCount = 0;
    let commentCount = 0;

    if (el.hearted && el.comments) {
      heartCount = el.heartCount;
      commentCount = el.comments.length;
    }

    let feedArt = document.createElement("article");
    feedArt.classList.add("art-post");
    feedArt.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="post-user">
      <img
        src="${userImg}"
        alt=""
        class="img-mini-profile"
      />
      <div>
        <h2 class="post-title">${username}</h2>
        <p class="post-user-id">@${accountname}</p>
      </div>
      <button>
        <img id="more" src="./img/more-vertical.png" alt="" />
      </button>
    </div>
    <!-- 포스트 메인-->
    <div class="post-main">
      <!-- 글 -->
      <div class="con-post-main">
        <p>
          ${content}
        </p>
        <img src="${feedImg}" alt="" class="feedImg" onerror="this.style.display='none'" />
      </div>
      <!-- likes -->
      <div class="con-reaction">
        <!-- likes & comments -->
        <ul class="list-reaction">
          <li class="likes">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" stroke="#767676" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.9201 3.0132C15.5202 2.60553 15.0455 2.28213 14.523 2.06149C14.0005 1.84085 13.4405 1.72728 12.8749 1.72728C12.3093 1.72728 11.7492 1.84085 11.2267 2.06149C10.7042 2.28213 10.2295 2.60553 9.82965 3.0132L8.99985 3.85888L8.17004 3.0132C7.3624 2.19011 6.267 1.72771 5.12483 1.72771C3.98265 1.72771 2.88725 2.19011 2.07961 3.0132C1.27197 3.83629 0.818237 4.95264 0.818237 6.11667C0.818237 7.28069 1.27197 8.39704 2.07961 9.22013L2.90941 10.0658L8.99985 16.2727L15.0903 10.0658L15.9201 9.22013C16.3201 8.81265 16.6374 8.32884 16.8539 7.79633C17.0704 7.26383 17.1819 6.69307 17.1819 6.11667C17.1819 5.54026 17.0704 4.96951 16.8539 4.437C16.6374 3.9045 16.3201 3.42069 15.9201 3.0132Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
            <span class="number">${heartCount}</span>
          </li>
          <li class="comments">
            <img src="./img/2/footer-icon/chat.svg" alt="" />
            <span class="number">${commentCount}</span>
          </li>
        </ul>
        <!-- 업로드 날짜 -->
        <p class="post-date">${year}년 ${month}월 ${date}일 </p>
        </div>
      </div>
    </div>
        `
    );
    listSec.appendChild(feedArt);
  });

  const feedImgsrcs = document.querySelectorAll(".feedImg");
  feedImgsrcs.forEach((feedImgsrc, i) => {
    if (i.src === "") {
      feedImgsrc.style.display = "none";
    }
  });

  const likesBtns = document.querySelectorAll(".likes svg");
  likesBtns.forEach((likeBtn) => {
    likeBtn.addEventListener("click", function () {
      if (likeBtn.classList.contains("likes-on")) {
        likeBtn.classList.remove("likes-on");
      } else {
        likeBtn.classList.add("likes-on");
      }
    });
  });
}

// const likesBtn = document.querySelector(".likes img");

// 피드 가져오기 앨범형식
async function GetAlbum() {
  const albumPhotoDiv = document.querySelector(".album-photos");
  const albumimgdata = await fetch(
    `http://146.56.183.55:5050/post/${authorAccount}/userpost`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const album = await albumimgdata.json();
  const albumPost = album.post;
  albumPost.forEach((el) => {
    const imgsrc = el.image;
    let albumDiv = document.createElement("div");
    albumDiv.innerHTML = `
    <div class="album-img-con">
      <a href="">
      <img src="${imgsrc}" alt="" onerror="this.style.display='none'" >
      </a>
    </div>
    `;
    const albumImgDiv = document.querySelector(".album-img-con");
    albumPhotoDiv.appendChild(albumDiv);
    // if (imgsrc === "") {
    //   albumImgDiv.style.display = "none";
    // }
  });
}

// 모달창 구현
let dotBtn = document.querySelector(".icon-more")
let modalBg = document.querySelector(".modal_bg")
let modal = document.querySelector(".userpage_modal")
let logout = document.querySelector(".user_logout")
let modalLogout = document.querySelector(".modal_logout")
let cancleBtn = document.querySelector(".cancle-btn")
let logoutBtn = document.querySelector(".logout-btn")

const open = () => {
  modalBg.classList.add("on")
  modal.classList.add("on")
}
const close = () => {
  modalBg.classList.remove("on")
  modal.classList.remove("on")
  modalLogout.classList.remove("on")
}

const Logout_open = () => {
  modalLogout.classList.add("on")
}
const Logout_close = () => {
  location.href = "./login.html"
}

dotBtn.addEventListener("click", open);
modalBg.addEventListener("click", close);
logout.addEventListener("click", Logout_open);
cancleBtn.addEventListener("click", close);
logoutBtn.addEventListener("click", Logout_close)