import {Form, Params, redirect, useLoaderData, useNavigate} from "react-router-dom";
import {updateSnippet} from "../snippets";

export async function action({request, params}: { request: Request, params: Params }) {
    const formData = await request.formData();
    console.log("Edit action", formData)
    const updates = Object.fromEntries(formData);
    console.log("Edit action", updates)
    await updateSnippet(params.snippetId || '', updates);
    return redirect(`/snippets/${params.snippetId}`);
}

export default function EditSnippet() {
    const {snippet} = useLoaderData() as { snippet: Snippet };
    console.log("Edit", snippet)
    const navigate = useNavigate();
    return (
        <Form method="post" id="snippet-form">
            <p>
                <span>Name</span>
                <input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="name"
                    defaultValue={snippet.name}
                />
            </p>
            <label>
                <span>Language</span>
                <input
                    type="text"
                    name="language"
                    placeholder="javascript..."
                    defaultValue={snippet.language}
                />
            </label>
            <label>
                <span>Type</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Type"
                    type="text"
                    name="type"
                    defaultValue={snippet.type}
                />
            </label>
            <label>
                <span>Tags</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="tags"
                    type="text"
                    name="tags"
                    defaultValue={snippet.tags}
                />
            </label>
            <label>
                <span>Content</span>
                <textarea
                    name="content"
                    defaultValue={snippet.content}
                    rows={6}
                />
            </label>
            <label>
                <span>Description</span>
                <textarea
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