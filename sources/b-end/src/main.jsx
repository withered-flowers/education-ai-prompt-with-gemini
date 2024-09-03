import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import store from "@/app/store";
import { Provider } from "react-redux";

import { RouterProvider } from "react-router-dom";
import router from "./routers";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>,
);
