const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const pages = [
    {url: '/', file: '/public/sign-in.html'},
    {url: '/sign-in', file: '/public/sign-in.html'},
    {url: '/sign-up', file: '/public/sign-up.html'},
    {url: '/posts', file: '/public/posts.html'},
    {url: '/posts/:id', file: '/public/post.html'},
    {url: '/edit-post', file: '/public/edit-post.html'},
    {url: '/update-post/:id', file: '/public/update-post.html'},
    {url: '/update-profile', file: '/public/update-profile.html'},
    {url: '/update-profile-password', file: '/public/update-profile-password.html'},
];

pages.forEach((page) => {
    app.get(page.url, (request, response) => {
        response.sendFile(path.join(__dirname, page.file));
    });
});

app.listen(3000);

// TODO
// 2024-04-27: update-post/:id가 맞을까?
