import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { List, Spin, Button, Card } from 'antd';

import { getLatestNews } from '../api/hackerNews';

const HomePage = observer(() => {
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchLatestNews();
        const interval = setInterval(fetchLatestNews, 60000); // Обновление каждую минуту

        return () => {
            clearInterval(interval); // Очистка интервала при размонтировании компонента
        };
    }, []);

    const fetchLatestNews = async () => {
        try {
            setLoading(true);
            const latestNews = await getLatestNews();
            const sortedNews = latestNews.sort((a, b) => b.time - a.time);
            console.log(sortedNews);
            setNews(sortedNews);
        } catch (error) {
            console.error('Error fetching latest news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchLatestNews();
    };

    return (
        <div>
            <h1 className="title">Последние новости</h1>
            <Button onClick={handleRefresh}>Обновить</Button> {/* Кнопка для принудительного обновления */}
            {loading ? (
                <Spin size="large" />
            ) : (
                <List
                    dataSource={news}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                style={{ width: '100%' }}
                                title={item.title}
                                extra={
                                    <Link to={`/news/${item.id}`}>
                                        &nbsp;Подробнее
                                    </Link>
                                }
                            >
                                <p>Рейтинг: {item.points || "Нет информации"}</p>
                                <p>Автор: {item.user || "Нет информации"}</p>
                                <p>Дата: {item.time_ago || "Нет информации"}</p>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
});

export default HomePage;
