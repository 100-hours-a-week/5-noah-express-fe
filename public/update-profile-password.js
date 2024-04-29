const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,20}$/;

// status
let validPasswordStatus = false;
let validPasswordCheckStatus = false;

function validteAll() {
  return validPasswordStatus && validPasswordCheckStatus;
}

const updateProfilePasswordButton = document.getElementById(
  'update-profile-password-button'
);

function changeButtonColor() {
  updateProfilePasswordButton.style.backgroundColor = validteAll()
    ? '#7F6AEE'
    : '#ACA0EB';
}

// 헤더, 드롭다운 관련 로직
const profileImageDropdown = document.querySelector('.profile-image-dropdown');

document.querySelector('.profile-image').addEventListener('click', () => {
  profileImageDropdown.classList.toggle('show');
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

updateProfilePasswordButton.addEventListener('click', () => {
  if (validteAll()) {
    window.location.href = '/post';
  }
});
