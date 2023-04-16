import {Params, useLoaderData} from "react-router-dom";
import {getSnippet} from "../snippets";
import s from "./Snippet.module.scss";
import dayjs from "dayjs";
import {useEffect} from "react";
import 'highlight.js/styles/github.css';
import hljs from "highlight.js"

export async function snippetLoader({params}: { params: Params }) {
    const snippet = await getSnippet(params.snippetId || "");
    if (!snippet) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    return {snippet};
}

export default function Snippet() {
    const {snippet} = useLoaderData() as { snippet: Snippet };
    useEffect(() => {
       hljs.highlightAll();
    },[snippet]);
    return (
        <>
            <div className={s.snippet}>
                <div className={s.header}>
                    <h3 className={s.name}>{snippet.name}</h3>
                    <span className={s.type}>{snippet.type}</span>
                </div>
                <pre className={s.content}>
                    <code className={`language-${snippet.language}`}>
                        {snippet.content}
                    </code>
                </pre>
                <div className={s.footer}>
                    <span className={s.language}>{snippet.language}</span>
                    <p className={s.description}>{snippet.description}</p>
                    {
                        snippet.tags && snippet.tags.length > 0 && (
                            <span className={s.tags}>{snippet.tags}</span>
                        )
                    }
                    <span className={s.createdAt}>{dayjs(snippet.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>

                </div>
            </div>
            <div className={s["button-group"]}>
                <button className={`${s["edit-button"]} ${s.button}`} type="button">
                    Edit
                </button>
                <button
                    className={`${s["delete-button"]} ${s.button}`}
                    type="button"
                >
                    Delete
                </button>
            </div>
        </>
    )
}