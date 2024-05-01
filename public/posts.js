// init
const SERVER_ADDRESS = 'http://localhost';
const SERVER_PORT = '8000';

// 드롭다운 관련 로직
const profileImageDropdown = document.querySelector('.profile-image-dropdown');

const userImage = document.getElementById('user-image');

userImage.addEventListener('click', () => {
    profileImageDropdown.classList.toggle('show');
});

const editPostButton = document.getElementById('edit-post-button');

editPostButton.addEventListener('click', () => {
    window.location.href = '/edit-post';
});

const signOutText = document.getElementById('sign-out-text');

signOutText.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/sign-out`, {
        method: 'DELETE', credentials: 'include',
    }).then((response) => {
        window.location.href = '/sign-in';
    });
});

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

// TODO session이 없다면 401로 처리하기 때문에 브라우저 콘솔에 error 뜸, 고민
fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/users/image`, {
    credentials: 'include',
}).then((response) => {
    if (!response.ok) {
        userImage.style.display = 'none';
        editPostButton.style.display = 'none';
    } else {
        response.json().then((json) => {
            userImage.src = `${SERVER_ADDRESS}:${SERVER_PORT}/${json.imageUrl}`;
        });
    }
});

fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts`)
    .then((response) => {
        if (response.ok) {
            response.json().then((posts) => {
                for (const post of posts) {
                    const postArticle = document.createElement('article');
                    postArticle.className = 'post';
                    postArticle.innerHTML = `
        <p class="post-title">${post.title}</p>
        <div>
          <span class="post-ect">좋아요</span>
          <span class="likes">${changeUnit(post.likes)}</span>
          <span class="post-ect">댓글</span>
          <span class="comments">${changeUnit(post.comments)}</span>
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
            src=${SERVER_ADDRESS}:${SERVER_PORT}/${post.author.imageUrl}
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
