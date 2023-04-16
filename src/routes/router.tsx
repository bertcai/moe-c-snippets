import {createBrowserRouter} from "react-router-dom";
import Home, {action as rootAction, loader as rootLoader} from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Index from "../pages/Index";
import Contact, {action as destroyAction, loader as contactLoader, updateAction} from "../pages/Contact";
import EditContact, {action as editAction} from "../pages/Edit";
import React from "react";
import Snippet, {snippetLoader} from "../components/Snippet";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        errorElement: <ErrorPage/>,
        loader: rootLoader,
        action: rootAction,
        children: [
            {
                errorElement: <ErrorPage/>,
                children: [
                    {
                        index: true, element: <Index/>,
                    },
                    {
                        path: "contacts/:contactId",
                        element: <Contact/>,
                        loader: contactLoader,
                        action: updateAction,
                    }, {
                        path: "contacts/:contactId/edit",
                        element: <EditContact/>,
                        loader: contactLoader,
                        action: editAction,
                    }, {
                        path: "contacts/:contactId/destroy",
                        action: destroyAction
                    },{
                        path: "snippets/:snippetId",
                        element: <Snippet/>,
                        loader: snippetLoader
                    },{
                        path: "snippets/:snippetId/edit",
                        element: <Snippet/>,
                    },{
                        path: "snippets/:snippetId/destroy",
                        action: destroyAction
                    }
                ]
            }
        ]
    },
]);
