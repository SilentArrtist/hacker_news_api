// Функция для получения последних новостей
export const getLatestNews = async () => {
    const response = await fetch('https://api.hnpwa.com/v0/news/1.json');
    const data = await response.json();
    return data;
};

// Функция для получения деталей новости
export const getNewsItem = async (itemId) => {
    const response = await fetch(`https://api.hnpwa.com/v0/item/${itemId}.json`);
    const data = await response.json();
    return data;
};

// Функция для получения комментариев к новости
export const getComments = async (itemId) => {
    const response = await fetch(`https://api.hnpwa.com/v0/item/${itemId}.json`);
    const data = await response.json();
    return data.comments || [];
};
