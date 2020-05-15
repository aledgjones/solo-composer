import { useState, useEffect } from "react";

interface IndexFile {
    featured: string[];
    articles: Articles;
}

interface Articles {
    [slug: string]: Article;
}

export interface Article {
    url: string;
    title: string;
    description: string;
    search: string[];
    related: string[];
}

export enum ArticleState {
    void,
    loading,
    ready,
    error
}

export function useArticlesList() {
    const [list, setList] = useState<IndexFile>({ featured: [], articles: {} });

    const call = async () => {
        const resp = await fetch("/articles/index.json");
        const index = (await resp.json()) as IndexFile;
        setList(index);
    };

    useEffect(() => {
        call();
    }, []);

    return list;
}

export function useArticle(article?: Article) {
    const [state, setState] = useState(ArticleState.void);
    const [content, setContent] = useState("");

    useEffect(() => {
        let dead = false;

        const call = async (url: string) => {
            try {
                setState(ArticleState.loading);
                const resp = await fetch(url);
                const md = await resp.text();
                if (!dead) {
                    setState(ArticleState.ready);
                    setContent(md);
                }
            } catch (e) {
                if (!dead) {
                    setState(ArticleState.error);
                }
            }
        };

        if (article) {
            call(article.url);
        } else {
            setState(ArticleState.void);
        }

        return () => {
            dead = true;
        };
    }, [article]);

    return { state, content };
}
