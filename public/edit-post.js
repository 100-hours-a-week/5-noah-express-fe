// init
const SERVER_ADDRESS = 'http://localhost';
const SERVER_PORT = '8000';

// status
let validTitleStatus = false;
let validContentStatus = false;

const helperText = document.getElementById('helper-text');
const updateProfilePasswordButton = document.getElementById('update-profile-password-button');

function changeHelpTextAndButtonColor() {
    if (validTitleStatus && validContentStatus) {
        helperText.innerText = '';

        updateProfilePasswordButton.style.backgroundColor = '#7F6AEE';
    } else {
        helperText.innerText = '* 제목, 내용을 모두 작성해주세요.';

        updateProfilePasswordButton.style.backgroundColor = '#ACA0EB';
    }
}

// 뒤로가기 버튼 관련 로직
document.querySelector('.move-posts').addEventListener('click', () => {
    window.location.href = '/posts';
});

// 드롭 다운 관련 로직
const profileImageDropdown = document.querySelector('.profile-image-dropdown');

const userImage = document.getElementById('user-image');

userImage.addEventListener('click', () => {
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

// TODO session이 없다면 401로 처리하기 때문에 브라우저 콘솔에 error 뜸, 고민
fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/users/image`, {
    credentials: 'include',
}).then((response) => {
    if (!response.ok) {
        alert('로그인이 필요합니다.');

        window.location.href = '/sign-in';
    } else {
        response.json().then((json) => {
            userImage.src = `${SERVER_ADDRESS}:${SERVER_PORT}/${json.imageUrl}`;
        });
    }
});

const createPostForm = document.getElementById('create-post-form');

createPostForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts`, {
        method: 'POST', body: new FormData(createPostForm), credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('불러오기 실패');
            }

            window.location.href = '/posts';
        })
        .catch((error) => {
            alert(error);

            console.error(error);
        });
});
