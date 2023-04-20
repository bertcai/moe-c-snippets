import {Form, NavLink, Outlet, redirect, useLoaderData, useNavigate, useNavigation,} from "react-router-dom";
import {Form as AntdForm, Input, Select,} from "antd";
import {createSnippet, getLanguagesList, getSnippets, getTagsList, getTypesList} from "../snippets";
import React, {useEffect} from "react";
import s from './Home.module.scss'
import {DownOutlined, UpOutlined} from "@ant-design/icons";

export async function action() {
    const snippets = await createSnippet();
    return redirect(`/snippets/${snippets.id}/edit`);
}

export async function loader({request}: { request: Request }) {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const snippets = await getSnippets(params);
    console.log("Home loader", snippets);
    const tagsList = await getTagsList()
    const languageList = await getLanguagesList()
    const typeList = await getTypesList()
    return {snippets, params, tagsList, languageList, typeList}
}

export default function Home() {
    const {
        snippets, params, tagsList, typeList, languageList
    } = useLoaderData() as {
        snippets: Snippet[],
        params: any,
        tagsList: Option[],
        languageList: Option[],
        typeList: Option[]
    };
    console.log(params)
    const navigation = useNavigation();
    const navigate = useNavigate()
    useEffect(() => {
        const searchInput = document.getElementById('q') as HTMLInputElement
        searchInput.value = params.q || ''
    }, [params.q])
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );
    const [form] = AntdForm.useForm()
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const toggleAdvanced = () => {
        setShowAdvanced(!showAdvanced);
        if (showAdvanced) {
            form.resetFields()
        }
    }
    const onSearch = (value: string) => {
        console.log('onSearch', value)
        const advanced = form.getFieldsValue()
        console.log(navigation.location?.pathname)
        navigate(`/?q=${value}&language=${advanced.language || ''}&type=${advanced.type || ''}&tags=${advanced.tags || ''}`)
    }
    return (
        <>
            <div id="sidebar">
                <h1>React Router Snippets</h1>
                <div>
                    <Input.Search
                        id="q"
                        className={searching ? "loading" : ""}
                        aria-label="Search snippets"
                        placeholder="Search"
                        type="search"
                        name="q"
                        defaultValue={params.q}
                        loading={searching}
                        onSearch={onSearch}
                    />
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <div className={s.advanceWrapper}>
                    <span className={s.advanceToggle} onClick={toggleAdvanced}>Advance Search {showAdvanced ?
                        <UpOutlined/> :
                        <DownOutlined/>}</span>
                    {showAdvanced && (
                        <div className={s.advanceFrom}>
                            <AntdForm
                                size={'small'}
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                                labelAlign={'left'}
                                form={form}
                            >
                                <AntdForm.Item label="Language" name={'language'}>
                                    <Select showSearch options={languageList} defaultValue={params.language}></Select>
                                </AntdForm.Item>
                                <AntdForm.Item label="Type" name={'type'}>
                                    <Select showSearch options={typeList} defaultValue={params.type}></Select>
                                </AntdForm.Item>
                                <AntdForm.Item label="Tags" name={'tags'}>
                                    <Select showSearch options={tagsList} defaultValue={params.tags}></Select>
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