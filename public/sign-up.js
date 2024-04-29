// init
const SERVER_ADDRESS = 'http://localhost';
const SERVER_PORT = '8080';

const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,20}$/;

// status
let validProfileImageStatus = false;
let validEmailStatus = false;
let validPasswordStatus = false;
let validPasswordCheckStatus = false;
let validNicknameStatus = false;

function validteAll() {
  return (
    validProfileImageStatus &&
    validEmailStatus &&
    validPasswordStatus &&
    validPasswordCheckStatus &&
    validNicknameStatus
  );
}

// status에 따라 회원가입 버튼 색 변경 로직
const signUpButton = document.getElementById('sign-up-button');

function changeButtonColor() {
  signUpButton.style.backgroundColor = validteAll() ? '#7F6AEE' : '#ACA0EB';
}

// 뒤로가기 버튼 관련 로직
document.querySelector('.move-sign-in-button').addEventListener('click', () => {
  window.location.href = '/sign-in';
});

// 프로필 사진 관련 로직
const profileImage = document.getElementById('profile-image');
const profileImageHelperText = document.getElementById(
  'profile-image-helper-text'
);

document
  .getElementById('profile-image-input')
  .addEventListener('change', function () {
    const selectedFile = this.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        profileImage.src = event.target.result;
      };

      reader.readAsDataURL(selectedFile); // 선택된 파일을 읽기 시작

      validProfileImageStatus = true;
    } else {
      profileImage.src = '/images/profile.png';

      validProfileImageStatus = false;
    }

    profileImageHelperText.innerText = validProfileImageStatus
      ? ''
      : '* 프로필 사진을 추가해주세요.';

    changeButtonColor();
  });

// 이메일 관련 로직
// 중복된 이메일 로직은 생략
const emailHelperText = document.getElementById('email-helper-text');
const emailInput = document.getElementById('email');

emailInput.addEventListener('change', () => {
  const value = emailInput.value.trim();

  validEmailStatus = emailRegex.test(value);

  emailHelperText.innerText = validEmailStatus
    ? ''
    : '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';

  changeButtonColor();
});

// 비밀번호 관련 로직
const passwordHelperText = document.getElementById('password-helper-text');
const passwordInput = document.getElementById('password');

passwordInput.addEventListener('change', () => {
  const value = passwordInput.value.trim();

  if (value.length == 0) {
    validPasswordStatus = false;

    passwordHelperText.innerText = '* 비밀번호를 입력해주세요.';
  } else {
    validPasswordStatus = passwordRegex.test(value);

    passwordHelperText.innerText = validPasswordStatus
      ? ''
      : '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
  }

  changeButtonColor();
});

// 비밀번호 확인 관련 로직
const passwordCheckHelperText = document.getElementById(
  'password-check-helper-text'
);
const passwordCheckInput = document.getElementById('password-check');

passwordCheckInput.addEventListener('change', () => {
  const value = passwordCheckInput.value.trim();

  if (value.length == 0) {
    validPasswordCheckStatus = false;

    passwordCheckHelperText.innerText = '* 비밀번호를 입력해주세요.';
  } else {
    validPasswordCheckStatus = passwordInput.value.trim() == value;

    passwordCheckHelperText.innerText = validPasswordCheckStatus
      ? ''
      : '* 비밀번호가 다릅니다.';
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

const signUpForm = document.getElementById('sign-up-form');

signUpForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('profile-image', profileImage.value);
  formData.append('email', emailInput.value);
  formData.append('password', passwordInput.value);

  fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/sign-up`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = '/sign-in';
      } else {
        response.json().then((body) => {
          alert(body.message);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
