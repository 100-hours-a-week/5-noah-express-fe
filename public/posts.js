// init
const SERVER_ADDRESS = 'http://localhost';
const SERVER_PORT = '8000';

// 드롭다운 관련 로직
const profileImageDropdown = document.querySelector('.profile-image-dropdown');

document.querySelector('.profile-image').addEventListener('click', () => {
  profileImageDropdown.classList.toggle('show');
});

document.getElementById('edit-post-button').addEventListener('click', () => {
  window.location.href = '/edit-post';
});

/* 2주차 2-2. Fetch 적용 */

// 글자 밀림 방지
function changeUnit(value) {
  if (isNaN(value) || value < 0) {
    text.innerText = 'ERROR';
  } else if (value < 1000) {
    return value;
  } else if (value < 10000) {
    return '1k';
  } else if (value < 100000) {
    return '10k';
  } else {
    return '100k';
  }
}

const postContainer = document.querySelector('.post-container');

fetch('./json/posts.json')
  .then((response) => {
    if (response.ok) {
      response.json().then((body) => {
        for (const post of body.posts) {
          const postArticle = document.createElement('article');
          postArticle.className = 'post';
          postArticle.innerHTML = `
        <p class="post-title">${post.title}</p>
        <div>
          <span class="post-ect">좋아요</span>
          <span class="likes">${changeUnit(post.likes)}</span>
          <span class="post-ect">댓글</span>
          <span class="comments">${changeUnit(post.comment.count)}</span>
          <span class="post-ect">조회수</span>
          <span class="views">${changeUnit(post.views)}</span>
          <span class="post-ect post-date" id="created-date"
            >${post.createdDate}</span
          >
        </div>

        <hr class="horizontal-rule" />

        <div class="dummy-container">
          <img
            class="image"
            src="${post.author.imageUrl}"
            width="36px"
            height="36px"
          />
          <span style="font-weight: bold">${post.author.name}</span>
        </div>        
        `;
          postArticle.addEventListener('click', () => {
            location.href = `/posts/${post.id}`;
          });

          postContainer.appendChild(postArticle);
        }
      });
    } else {
      alert('불러오기 실패');
    }
  })
  .catch((error) => {
    console.error(error);
  });
