import {Form, Params, redirect, useLoaderData, useNavigate} from "react-router-dom";
import {updateSnippet} from "../snippets";
import {Input, Select} from "antd";
import {supportedLanguages} from "../assets/const";
import React, {useState} from "react";

export async function action({request, params}: { request: Request, params: Params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    console.log("Edit action", updates)
    await updateSnippet(params.snippetId || '', updates);
    return redirect(`/snippets/${params.snippetId}`);
}

export default function EditSnippet() {
    const {snippet} = useLoaderData() as { snippet: Snippet };
    console.log("Edit", snippet)
    const navigate = useNavigate();
    const formRef = React.useRef<HTMLFormElement>(null);
    const [language, setLanguage] = useState('')
    return (
        <Form ref={formRef} method="post" id="snippet-form">
            <label>
                <span>Name</span>
                <Input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="name"
                    defaultValue={snippet.name}
                />
            </label>
            <label>
                <span>Language</span>
                <Select
                    className={"select"}
                    showSearch
                    defaultValue={snippet.language}
                    onChange={(value) => {
                       setLanguage(value)
                    }}
                    options={supportedLanguages.map(language => ({value: language, label: language}))}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
                <input className={'hidden-element'} name="language" value={language} readOnly/>
            </label>
            <label>
                <span>Type</span>
                <Input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Type"
                    type="text"
                    name="type"
                    defaultValue={snippet.type}
                />
            </label>
            <label>
                <span>Tags</span>
                <Input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="tags"
                    type="text"
                    name="tags"
                    defaultValue={snippet.tags}
                />
            </label>
            <label>
                <span>Content</span>
                <Input.TextArea
                    name="content"
                    defaultValue={snippet.content}
                    rows={6}
                />
            </label>
            <label>
                <span>Description</span>
                <Input.TextArea
                    name="description"
                    defaultValue={snippet.description}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={
                    () => {
                        navigate(-1)
                    }
                }>Cancel
                </button>
            </p>
        </Form>
    );
}