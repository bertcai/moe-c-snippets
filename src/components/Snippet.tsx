import {Form, Params, redirect, useLoaderData} from "react-router-dom";
import {deleteSnippet, getSnippet} from "../snippets";
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

export async function destroyAction({params}: { params: Params }) {
    await deleteSnippet(params.snippetId || '');
    return redirect("/");
}

export default function Snippet() {
    const {snippet} = useLoaderData() as { snippet: Snippet };
    useEffect(() => {
        hljs.highlightAll();
    }, [snippet]);
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
                <Form action="edit">
                    <button type="submit">Edit</button>
                </Form>
                <Form
                    method="post"
                    action="destroy"
                    onSubmit={(event) => {
                        if (
                            !confirm(
                                "Please confirm you want to delete this record."
                            )
                        ) {
                            event.preventDefault();
                        }
                    }}
                >
                    <button type="submit">Delete</button>
                </Form>
            </div>
        </>
    )
}