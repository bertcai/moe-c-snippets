import {createBrowserRouter} from "react-router-dom";
import Home, {action as rootAction, loader as rootLoader} from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Index from "../pages/Index";
import React from "react";
import Snippet, {snippetLoader,destroyAction} from "../components/Snippet";
import EditSnippet ,{action as editAction} from "../pages/Edit";

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
                        path: "snippets/:snippetId",
                        element: <Snippet/>,
                        loader: snippetLoader
                    },{
                        path: "snippets/:snippetId/edit",
                        element: <EditSnippet/>,
                        action: editAction,
                        loader: snippetLoader
                    },{
                        path: "snippets/:snippetId/destroy",
                        action: destroyAction
                    }
                ]
            }
        ]
    },
],{basename: '/snippets'});
