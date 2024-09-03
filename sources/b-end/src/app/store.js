import { configureStore } from "@reduxjs/toolkit";

import geminiReducer from "@/features/gemini-slice";

const store = configureStore({
	reducer: {
		gemini: geminiReducer,
	},
});

export default store;
