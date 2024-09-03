import { createSlice } from "@reduxjs/toolkit";

const geminiSlice = createSlice({
	name: "gemini",
	initialState: {
		isLoading: false,
		isError: false,
		promptInput: undefined,
		promptResponse: undefined,
		error: undefined,
	},
	reducers: {
		geminiPendingState: (state) => {
			state.isPending = true;
			state.isError = false;
			state.promptInput = undefined;
			state.promptResponse = undefined;
			state.error = undefined;
		},
		geminiSetRefinedInput: (state, action) => {
			state.promptInput = action.payload;
		},
		geminiSuccessResponse: (state, action) => {
			state.isPending = false;
			state.isError = false;
			state.promptResponse = action.payload;
		},
		geminiErrorResponse: (state, action) => {
			state.isPending = false;
			state.isError = true;
			state.error = action.payload;
		},
	},
});

export const promptToGemini = (feedInput) => async (dispatch) => {
	try {
		dispatch(geminiPendingState());

		// ! Di sini kita akan memanggil Gemini

		const finalInput = `${feedInput}, coba lihat di console datanya ada apa yah.`;

		dispatch(geminiSetRefinedInput(finalInput));

		dispatch(geminiSuccessResponse());
	} catch (err) {
		dispatch(geminiErrorResponse(err));
	}
};

export const {
	geminiPendingState,
	geminiSetRefinedInput,
	geminiSuccessResponse,
	geminiErrorResponse,
} = geminiSlice.actions;
export default geminiSlice.reducer;
