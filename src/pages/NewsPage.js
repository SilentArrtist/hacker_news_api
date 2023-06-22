import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Card, Spin, Button } from 'antd';

import { getNewsItem, getComments } from '../api/hackerNews';

import '../styles/NewsPage.css'

const NewsPage = observer(() => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [newsItem, setNewsItem] = useState(null);
    const [comments, setComments] = useState([]);
    const [expandedComments, setExpandedComments] = useState([]);

    useEffect(() => {
        fetchNewsItem();
        fetchComments();
    }, []);

    const fetchNewsItem = async () => {
        try {
            setLoading(true);
            const item = await getNewsItem(id);
            console.log(item);
            setNewsItem(item);
        } catch (error) {
            console.error('Error fetching news item:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsData = await getComments(id);
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleExpandComments = (commentId) => {
        if (expandedComments.includes(commentId)) {
            setExpandedComments((prevExpandedComments) => prevExpandedComments.filter((id) => id !== commentId));
        } else {
            setExpandedComments((prevExpandedComments) => [...prevExpandedComments, commentId]);
        }
    };

    const handleRefresh = () => {
        fetchComments();
    };

    return (
        <div className="news-page">
            {loading ? (
                <Spin size="large" />
            ) : (
                <div>
                    <Card
                        title={newsItem.title}
                        extra={
                            <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
                                Перейти к новости
                            </a>
                        }
                        className="news-card"
                    >
                        <p className="news-date">Дата: {newsItem.time_ago || "Нет информации"}</p>
                        <p className="news-author">Автор: {newsItem.user || "Нет информации"}</p>
                        <p className="news-comments-count">Количество комментариев: {newsItem.comments_count || "Нет информации"}</p>
                    </Card>
                    <Button><Link to="/">Назад к списку новостей</Link></Button>

                    <h2>Комментарии</h2>
                    <Button onClick={handleRefresh}>Обновить</Button> {/* Кнопка для принудительного обновления */}
                    <div className="comments-container">
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <span className="comment-author">Автор: {comment.user}</span>
                                <br />
                                {<div dangerouslySetInnerHTML={{ __html: comment.content }} />}
                                {comment.comments.length > 0 && (
                                    <div>
                                        <button style={{ margin: "10px 0" }} onClick={() => handleExpandComments(comment.id)}>
                                            {expandedComments.includes(comment.id) ? 'Скрыть комментарии' : 'Показать комментарии'}
                                        </button>
                                        {expandedComments.includes(comment.id) && (
                                            <div className="replies-container">
                                                {comment.comments.map((reply) => (
                                                    <div key={reply.id} className="reply">
                                                        <span className="reply-author">Автор: {reply.user}</span>
                                                        <br />
                                                        {<div dangerouslySetInnerHTML={{ __html: reply.content }} />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default NewsPage;

