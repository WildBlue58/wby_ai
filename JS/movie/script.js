// 配置信息
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

// DOM 元素
const oForm = document.querySelector('#form');
const oInput = document.querySelector('#search');
const main = document.querySelector('#main');

// 显示加载状态
const showLoading = () => {
    main.innerHTML = '<div class="loading">加载中...</div>';
}

// 显示错误信息
const showError = (message) => {
    main.innerHTML = `<div class="error">${message}</div>`;
}

// 获取电影数据
const getMovies = async (keyword) => {
    try {
        showLoading();
        let reqUrl = keyword ? SEARCH_API + keyword : API_URL;
        
        const response = await fetch(reqUrl);
        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        
        const data = await response.json();
        if (data.results.length === 0) {
            showError('未找到相关电影');
            return;
        }
        
        showMovies(data.results);
    } catch (error) {
        showError('获取电影数据失败，请稍后重试');
        console.error('Error:', error);
    }
}

// 渲染电影列表
const showMovies = (movies) => {
    main.innerHTML = movies.map(movie => {
        const { 
            poster_path, 
            title, 
            vote_average, 
            overview,
            release_date 
        } = movie;

        // 处理图片路径
        const imgPath = poster_path 
            ? IMG_PATH + poster_path 
            : 'https://via.placeholder.com/300x450?text=No+Image';

        // 处理评分显示
        const rating = vote_average.toFixed(1);
        const ratingClass = vote_average >= 8 ? 'high-rating' : 
                          vote_average >= 5 ? 'medium-rating' : 
                          'low-rating';

        return `
        <div class="movie">
            <img src="${imgPath}" alt="${title}" loading="lazy">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${ratingClass}">${rating}</span>
            </div>
            <div class="overview">
                <h3>${title}</h3>
                <p class="release-date">上映日期: ${release_date || '未知'}</p>
                <p class="rating">评分: ${rating}</p>
                <p class="description">${overview || '暂无简介'}</p>
            </div>
        </div>
        `;
    }).join('');
}

// 防抖函数
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

// 搜索处理函数
const handleSearch = (event) => {
    event.preventDefault();
    const search = oInput.value.trim();
    if (search) {
        getMovies(search);
    } else {
        getMovies(); // 如果搜索框为空，显示热门电影
    }
}

// 页面加载完成后执行
window.addEventListener('load', () => {
    getMovies();
});

// 添加搜索事件监听
oForm.addEventListener('submit', handleSearch);

// 添加输入防抖
oInput.addEventListener('input', debounce((e) => {
    const search = e.target.value.trim();
    if (search) {
        getMovies(search);
    }
}, 500));
    