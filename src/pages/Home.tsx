import {Form, NavLink, Outlet, redirect, useLoaderData, useNavigation, useSubmit,} from "react-router-dom";
import {createSnippet, getSnippets} from "../snippets";
import {useEffect} from "react";
import {Input} from "antd";

export async function action() {
    const snippets = await createSnippet();
    return redirect(`/snippets/${snippets.id}/edit`);
}

export async function loader({request}: { request: Request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || '';
    const snippets = await getSnippets(q);
    console.log("Home loader", snippets);
    return {snippets, q};
}

export default function Home() {
    const {snippets, q} = useLoaderData() as { snippets: Snippet[], q: string };
    const navigation = useNavigation();
    const submit = useSubmit();
    useEffect(() => {
        const searchInput = document.getElementById('q') as HTMLInputElement
        searchInput.value = q
    }, [q])
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );
    return (
        <>
            <div id="sidebar">
                <h1>React Router Snippets</h1>
                <div>
                    <Form id="search-form" role="search">
                        <Input.Search
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search snippets"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                            loading={searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {snippets.length ? (
                        <ul>
                            {snippets.map((snippet) => (
                                <li key={snippet.id}>
                                    <NavLink to={`snippets/${snippet.id}`}
                                             className={({isActive, isPending}) =>
                                                 isActive ? "active" : isPending ? "pending" : ""}
                                    >
                                        {snippet.name ? (
                                            <>
                                                {snippet.name}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No snippets</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail" className={
                navigation.state === "loading" ? "loading" : ""
            }>
                <Outlet/>
            </div>
        </>
    );
}