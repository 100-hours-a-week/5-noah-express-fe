const postId = parseInt(window.location.href.match(/\/(\d+)$/)[1]);

// status
let validTitleStatus = true;
let validContentStatus = true;

const helperText = document.querySelector('.helper-text');
const updatePostButton = document.getElementById('update-post-button');

function changeHelpTextAndButtonColor() {
  if (validTitleStatus && validContentStatus) {
    helperText.innerText = '';

    updatePostButton.style.backgroundColor = '#7F6AEE';
  } else {
    helperText.innerText = '* 제목, 내용을 모두 작성해주세요.';

    updatePostButton.style.backgroundColor = '#ACA0EB';
  }
}

// 뒤로가기 버튼 로직
document.querySelector('.move-page-button').addEventListener('click', () => {
  window.location.href = '/posts';
});

// 드롭다운 메뉴 관련 로직
const profileImageDropdown = document.querySelector('.profile-image-dropdown');

document.querySelector('.profile-image').addEventListener('click', () => {
  profileImageDropdown.classList.toggle('show');
});

// 제목 관련 로직
const titleInput = document.getElementById('title');

titleInput.addEventListener('change', () => {
  const value = titleInput.value.trim();

  validTitleStatus = value.length != 0;

  changeHelpTextAndButtonColor();
});

// 내용 관련 로직
const contentInput = document.getElementById('content');

contentInput.addEventListener('change', () => {
  const value = contentInput.value.trim();

  validContentStatus = value.length != 0;

  changeHelpTextAndButtonColor();
});

fetch('/json/posts.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  })
  .then((json) => {
    const foundPost = json.posts.find(post => post.id === postId);

    if (!foundPost) {
      throw new Error();
    }

    titleInput.value = foundPost.title;
    contentInput.value = foundPost.content;
  })
  .catch(error => {
    alert(error.message);

    console.error(error);
  });