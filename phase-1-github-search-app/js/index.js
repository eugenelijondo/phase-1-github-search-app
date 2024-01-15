const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const toggleSearchTypeButton = document.getElementById('toggleSearchType');
const resultsContainer = document.getElementById('results');

let searchType = 'user'; // Default search type

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        if (searchType === 'user') {
            searchUsers(searchTerm);
        } else {
            searchRepos(searchTerm);
        }
    }
});

toggleSearchTypeButton.addEventListener('click', function () {
    searchType = searchType === 'user' ? 'repo' : 'user';
    searchInput.placeholder = `Enter GitHub ${searchType === 'user' ? 'username' : 'repository name'}`;
});

async function searchUsers(username) {
    const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    displayUsers(data.items);
}

async function searchRepos(repoName) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${repoName}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    displayRepos(data.items);
}

function displayUsers(users) {
    resultsContainer.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="50">
            <p><strong>${user.login}</strong></p>
            <a href="${user.html_url}" target="_blank">View Profile</a>
        `;
        userDiv.addEventListener('click', () => {
            getUserRepos(user.login);
        });
        resultsContainer.appendChild(userDiv);
    });
}

async function getUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const repos = await response.json();
    displayRepos(repos);
}

function displayRepos(repos) {
    resultsContainer.innerHTML = '';
    repos.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.innerHTML = `<p><strong>${repo.name}</strong></p>`;
        resultsContainer.appendChild(repoDiv);
    });
}
