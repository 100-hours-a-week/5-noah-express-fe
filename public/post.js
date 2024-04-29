// init
const SERVER_ADDRESS = 'http://localhost';
const SERVER_PORT = '8000';

const postId = parseInt(window.location.href.match(/\/(\d+)$/)[1]);

// 전역으로 삭제 댓글 id전달
let deleteCommentId = -1;

// 뒤로가기 버튼 로직
document.querySelector('.move-posts').addEventListener('click', () => {
    window.location.href = '/posts';
});

// 드롭다운 메뉴 로직
const profileImageDropdown = document.querySelector('.profile-image-dropdown');

document.querySelector('.profile-image').addEventListener('click', () => {
    profileImageDropdown.classList.toggle('show');
});

function createPostUpdateButton() {
    const postUpdateButton = document.createElement('button');
    postUpdateButton.className = 'post-button';
    postUpdateButton.id = 'post-update-button';
    postUpdateButton.innerText = '수정';

    postUpdateButton.addEventListener('click', () => {
        // Q: query string 말고 다른 방법 없나?
        window.location.href = `/update-post/${postId}`;
    });

    return postUpdateButton;
}

// 게시글 삭제 버튼 관련 로직
const postDeleteModal = document.getElementById('post-delete-modal');

function createPostDeleteButton() {
    const postDeleteButton = document.createElement('button');
    postDeleteButton.className = 'post-button';
    postDeleteButton.id = 'post-delete-button';
    postDeleteButton.innerText = '삭제';

    postDeleteButton.addEventListener('click', () => {
        // 스크롤 방지
        document.body.classList.add('stop-scroll');

        postDeleteModal.style.display = 'flex';
    });

    return postDeleteButton;
}

function createCommentUpdateButton(commentId) {
    const commentUpdateButton = document.createElement('button');
    commentUpdateButton.className = 'comment-button';
    commentUpdateButton.innerText = '수정';

    commentUpdateButton.addEventListener('click', () => {
        alert(`postId: ${postId}, commentId: ${commentId}, 미구현!`);
    });

    return commentUpdateButton;
}

const commentDeleteModal = document.getElementById('comment-delete-modal');

function createCommentDeleteButton(commentId) {
    const commentDeleteButton = document.createElement('button');
    commentDeleteButton.classList.add('comment-button', 'comment-delete-button');
    commentDeleteButton.innerText = '삭제';

    commentDeleteButton.addEventListener('click', () => {
        document.body.classList.add('stop-scroll');

        deleteCommentId = commentId;

        commentDeleteModal.style.display = 'flex';
    });

    return commentDeleteButton;
}

function createCommentContainer(commentId, author, createdDate, content) {
    const commentContainer = document.createElement('div');
    commentContainer.className = 'comment-container';

    const commentInfo = document.createElement('div');
    commentInfo.className = 'comment-info';

    const commentAuthorImage = document.createElement('img');
    commentAuthorImage.className = 'comment-author-image';
    commentAuthorImage.src = `${SERVER_ADDRESS}:${SERVER_PORT}/${author.imageUrl}`;

    commentInfo.appendChild(commentAuthorImage);

    const commentAuthorName = document.createElement('span');
    commentAuthorName.className = 'comment-author-name';
    commentAuthorName.innerText = `${author.name}`;

    commentInfo.appendChild(commentAuthorName);

    const commentCreatedDate = document.createElement('span');
    commentCreatedDate.className = 'comment-date-text';
    commentCreatedDate.innerText = `${createdDate}`;

    commentInfo.appendChild(commentCreatedDate);

    const commentButtonContainer = document.createElement('div');
    commentButtonContainer.className = 'comment-button-container';

    commentButtonContainer.appendChild(createCommentUpdateButton(commentId));
    commentButtonContainer.appendChild(createCommentDeleteButton(commentId));

    commentInfo.appendChild(commentButtonContainer);

    commentContainer.appendChild(commentInfo);

    const commentContent = document.createElement('p');
    commentContent.className = 'comment-content';
    commentContent.innerText = `${content}`;

    commentContainer.appendChild(commentContent);

    return commentContainer;
}

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

// 댓글 입력 관련 로직
const commentInput = document.getElementById('comment-input');
const commentSubmitButton = document.getElementById('comment-submit-button');

commentInput.addEventListener('change', () => {
    const value = commentInput.value.trim();

    commentSubmitButton.style.backgroundColor = value.length == 0 ? '#ACA0EB' : '#7F6AEE';
});

// 게시글 삭제 버튼, 취소
document
    .getElementById('post-delete-modal-cancel-button')
    .addEventListener('click', () => {
        // 스크롤 방지 해제
        document.body.classList.remove('stop-scroll');

        postDeleteModal.style.display = 'none';
    });

// 게시글 삭제 버튼, 확인
document
    .getElementById('post-delete-modal-confirm-button')
    .addEventListener('click', () => {
        fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts/${postId}`, {
            method: 'DELETE',
        }).then((response) => {
            if (!response.ok) {
                throw new Error('삭제 실패');
            }
        }).catch((error) => {
            alert(error.message);

            console.error(error);
        }).finally(() => {
            // 스크롤 방지 해제
            document.body.classList.remove('stop-scroll');

            postDeleteModal.style.display = 'none';

            window.location.href = '/posts';
        });
    });

// 댓글 삭제 버튼, 취소
document
    .getElementById('comment-delete-modal-cancel-button')
    .addEventListener('click', () => {
        deleteCommentId = -1;

        // 스크롤 방지 해제
        document.body.classList.remove('stop-scroll');

        commentDeleteModal.style.display = 'none';
    });

// 댓글 삭제 버튼, 확인
document
    .getElementById('comment-delete-modal-confirm-button')
    .addEventListener('click', () => {
        fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts/${postId}/comments`, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                id: deleteCommentId,
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error('댓글 삭제 실패');
            }

            window.location.href = `/posts/${postId}`;
        }).catch((error) => {
            alert(error.message);

            window.location.href = '/posts';
        }).finally(() => {
            // 필요한가?
            // 스크롤 방지 해제
            document.body.classList.remove('stop-scroll');

            commentDeleteModal.style.display = 'none';
        });
    });

const postHeader = document.getElementById('post-header');
const postBody = document.getElementById('post-body');
const postViews = document.getElementById('views-value-text');
const postComments = document.getElementById('comments-value-text');

const commentsConainer = document.getElementById('comments-container');

fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts/${postId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('불러오기 실패');
        }

        response.json().then(foundPost => {
            const postTitle = document.createElement('p');
            postTitle.innerText = `${foundPost.title}`;
            postTitle.id = 'post-title';

            postHeader.appendChild(postTitle);

            const postInfoContainer = document.createElement('div');
            postInfoContainer.id = 'post-info-container';

            const postAuthorImage = document.createElement('img');
            postAuthorImage.id = 'post-author-image';
            postAuthorImage.src = `${SERVER_ADDRESS}:${SERVER_PORT}/${foundPost.author.imageUrl}`;

            postInfoContainer.appendChild(postAuthorImage);

            const postAuthorName = document.createElement('span');
            postAuthorName.id = 'post-author-name';
            postAuthorName.innerText = `${foundPost.author.name}`;

            postInfoContainer.appendChild(postAuthorName);

            const postCreatedDate = document.createElement('span');
            postCreatedDate.id = 'post-created-date';
            postCreatedDate.innerText = `${foundPost.createdDate}`;

            postInfoContainer.appendChild(postCreatedDate);

            postInfoContainer.appendChild(createPostUpdateButton());
            postInfoContainer.appendChild(createPostDeleteButton());

            postHeader.appendChild(postInfoContainer);

            if (foundPost.imageUrl) {
                const postImage = document.createElement('img');
                postImage.id = 'post-image';
                postImage.src = `${SERVER_ADDRESS}:${SERVER_PORT}/${foundPost.imageUrl}`;

                postBody.appendChild(postImage);
            }

            const postContent = document.createElement('p');
            postContent.innerText = `${foundPost.content}`;

            postBody.appendChild(postContent);

            postViews.innerText = `${changeUnit(foundPost.views)}`;
            postComments.innerText = `${changeUnit(foundPost.comments.count)}`;

            foundPost.comments.comments.forEach(comment => {
                commentsConainer.appendChild(createCommentContainer(comment.id, comment.author, comment.createdDate, comment.content));
            });
        });
    })
    .catch(error => {
        alert(error.message);

        console.error(error);
    });

const createCommentForm = document.getElementById('create-comment-form');

createCommentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch(`${SERVER_ADDRESS}:${SERVER_PORT}/api/posts/${postId}/comments`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({
            content: commentInput.value,
        }),
    }).then((response) => {
        if (!response.ok) {
            throw new Error('댓글 작성 실패');
        }

        window.location.href = `/posts/${postId}`;
    }).catch((error) => {
        alert(error.message);

        window.location.href = '/posts';
    });
});
