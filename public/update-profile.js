// init
const SERVER_ADDRESS = 'http://localhost';
const SERVER_PORT = '8000';

// status
let validprofileImage2Status = false;
let validNicknameStatus = false;

function validteAll() {
    return validprofileImage2Status && validNicknameStatus;
}

const updateProfileButton = document.getElementById('update-profile-button');

function changeButtonColor() {
    updateProfileButton.style.backgroundColor = validteAll() ? '#7F6AEE' : '#ACA0EB';
}

// 헤더, 드롭다운 관련 로직
const profileImageDropdown = document.querySelector('.profile-image-dropdown');

const userImage = document.getElementById('user-image');

userImage.addEventListener('click', () => {
    profileImageDropdown.classList.toggle('show');
});

// 프로필 사진 관련 로직
const userImagePreview = document.getElementById('user-image-preview');

document
    .getElementById('profile-image2-input')
    .addEventListener('change', function () {
        const selectedFile = this.files[0];

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (event) => {
                userImagePreview.src = event.target.result;
            };

            reader.readAsDataURL(selectedFile); // 선택된 파일을 읽기 시작

            validprofileImage2Status = true;
        } else {
            userImagePreview.src = '/images/profile.png';

            validprofileImage2Status = false;
        }

        changeButtonColor();
    });

// 닉네임 관련 로직
const nicknameHelperText = document.getElementById('nickname-helper-text');
const nicknameInput = document.getElementById('nickname');

nicknameInput.addEventListener('change', () => {
    const value = nicknameInput.value.trim();

    if (value.length == 0) {
        validNicknameStatus = false;

        nicknameHelperText.innerText = '* 닉네임를 입력해주세요.';
    } else if (value.length > 10) {
        validNicknameStatus = false;

        nicknameHelperText.innerText = '* 닉네임은 최대 10자 까지 작성 가능합니다.';
    } else if (value.includes(' ')) {
        validNicknameStatus = false;

        nicknameHelperText.innerText = '* 띄어쓰기를 없애주세요.';
    } else {
        validNicknameStatus = true;

        nicknameHelperText.innerText = '';
    }

    changeButtonColor();
});

// 수정하기 버튼 관련 로직
const toastMessage = document.getElementById('toast-message');

updateProfileButton.addEventListener('click', () => {
    if (validteAll()) {
        toastMessage.style.display = 'block';

        setTimeout(() => {
            toastMessage.style.display = 'none';
        }, 1000);
    }
});

// 모달 창 관련 로직
const deleteAccountText = document.getElementById('move-delete-modal');
const modalContainer = document.getElementById('modal-container');

deleteAccountText.addEventListener('click', () => {
    // 스크롤 방지
    document.body.classList.add('stop-scroll');

    modalContainer.style.display = 'flex';
});

// 모달 창 취소 버튼 관련 로직
document
    .getElementById('delete-check-modal-cancel-button')
    .addEventListener('click', () => {
        // 스크롤 방지 해제
        document.body.classList.remove('stop-scroll');

        modalContainer.style.display = 'none';
    });

// 모달 창 확인 버튼 관련 로직
document
    .getElementById('delete-check-modal-confirm-button')
    .addEventListener('click', () => {
        // 스크롤 방지 해제
        document.body.classList.remove('stop-scroll');

        window.location.href = '/sign-in';
    });

const userEmailText = document.getElementById('user-email-text');

fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/users/update/image-and-nickname`, {
    credentials: 'include',
})
    .then((response) => {
        if (!response.ok) {
            response.json().then((json) => {
                alert(json.message);

                window.location.href = '/sign-in';
            });
        } else {
            response.json().then((json) => {
                userImage.src = `${SERVER_ADDRESS}:${SERVER_PORT}/${json.imageUrl}`;

                userImagePreview.src = `${SERVER_ADDRESS}:${SERVER_PORT}/${json.imageUrl}`;
                userEmailText.innerText = json.email;
                nicknameInput.value = json.nickname;
            });
        }
    });


const updateUserForm = document.getElementById('update-user-form');
updateUserForm.addEventListener('submit', (event) => {
    fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/users/update/image-and-nickname`, {
        method: 'POST', body: new FormData(updateUserForm), credentials: 'include',
    }).then((response) => {
        if (!response.ok) {
            response.json().then((json) => {
                alert(json.message);
            });
        } else {
            window.location.href = '/posts';
        }
    });
});
