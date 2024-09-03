import { createSlice } from "@reduxjs/toolkit";

import { GEMINI_API_KEY } from "@/constants";
import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
	// SchemaType,
} from "@google/generative-ai";

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
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			// ? Hasil akhinya dalam bentuk json
			// generationConfig: {
			// 	responseMimeType: "application/json",
			// 	responseSchema: {
			// 		type: SchemaType.ARRAY,
			// 		items: {
			// 			type: SchemaType.OBJECT,
			// 			properties: {
			// 				recipe_name: {
			// 					type: SchemaType.STRING,
			// 				},
			// 			},
			// 		},
			// 	},
			// },
		});

		const generationConfig = {
			temperature: 1,
			topP: 0.95,
			topK: 64,
			maxOutputTokens: 8192,
			responseMimeType: "text/plain",
		};

		const chatSession = model.startChat({
			generationConfig,
			history: [],
			// ? Safety
			safetySettings: [
				{
					category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
					threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
				},
				{
					category: HarmCategory.HARM_CATEGORY_HARASSMENT,
					threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
				},
			],
		});

		// ? Modifikasi input untuk meminta json
		const finalInput = feedInput;
		// const finalInput = `${feedInput} output using this json schema: { 'type': 'object', 'properties': { 'recipe_name': {'type': 'string'} } `;

		dispatch(geminiSetRefinedInput(finalInput));

		const result = await chatSession.sendMessage(finalInput);

		dispatch(geminiSuccessResponse(result.response.text()));
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
