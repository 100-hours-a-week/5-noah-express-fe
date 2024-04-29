// init
const SERVER_ADDRESS = 'http://localhost';
const SERVER_PORT = '8000';

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

const updatePostForm = document.getElementById('update-post-form');

updatePostForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formDate = new FormData(updatePostForm);
    formDate.set('content', contentInput.value);

    fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts/${postId}`, {
        method: 'PATCH', body: formDate,
    }).then((response) => {
        if (!response.ok) {
            throw new Error('게시물 수정 실패');
        }

        window.location.href = `/posts/${postId}`;
    }).catch((error) => {
        alert(error);

        console.error(error);

        window.location.href = '/posts';
    });
});


fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts/${postId}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error('게시글 불러오기 실패');
        }

        return response.json();
    })
    .then((post) => {
        titleInput.value = post.title;
        contentInput.value = post.content;
    })
    .catch(error => {
        alert(error.message);

        console.error(error);

        window.location.href = '/posts';
    });
