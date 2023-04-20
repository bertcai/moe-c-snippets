import {Form, NavLink, Outlet, redirect, useLoaderData, useNavigation, useSubmit,} from "react-router-dom";
import {Form as AntdForm, Input, Select,} from "antd";
import {createSnippet, getLanguagesList, getSnippets, getTagsList, getTypesList} from "../snippets";
import React, {useEffect} from "react";
import s from './Home.module.scss'

export async function action() {
    const snippets = await createSnippet();
    return redirect(`/snippets/${snippets.id}/edit`);
}

export async function loader({request}: { request: Request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || '';
    const snippets = await getSnippets(q);
    console.log("Home loader", snippets);
    const tagsList = await getTagsList()
    const languageList = await getLanguagesList()
    const typeList = await getTypesList()
    return {snippets, q, tagsList, languageList, typeList}
}

export default function Home() {
    const {
        snippets, q, tagsList, typeList, languageList
    } = useLoaderData() as {
        snippets: Snippet[],
        q: string,
        tagsList: Option[],
        languageList: Option[],
        typeList: Option[]
    };
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
    const formRef = React.useRef<HTMLFormElement>(null);
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const toggleAdvanced = () => {
        setShowAdvanced(!showAdvanced);
    }
    return (
        <>
            <div id="sidebar">
                <h1>React Router Snippets</h1>
                <div>
                    <Form ref={formRef} id="search-form" role="search">
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
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <div className={s.advanceWrapper}>
                    <span onClick={toggleAdvanced}>Advance Search</span>
                    {showAdvanced && (
                        <div className={s.advanceFrom}>
                            <AntdForm
                                size={'small'}
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                                labelAlign={'left'}
                            >
                                <AntdForm.Item label="Language">
                                    <Select showSearch options={languageList}></Select>
                                </AntdForm.Item>
                                <AntdForm.Item label="Type">
                                    <Select showSearch options={typeList}></Select>
                                </AntdForm.Item>
                                <AntdForm.Item label="Tags">
                                    <Select showSearch options={tagsList} ></Select>
                                </AntdForm.Item>
                            </AntdForm>
                        </div>
                    )}
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