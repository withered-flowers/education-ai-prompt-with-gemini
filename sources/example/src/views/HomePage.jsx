import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import { promptToGemini } from "@/features/gemini-slice";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
	const dispatch = useDispatch();
	const { promptInput, promptResponse, isError, error, isPending } =
		useSelector((reducerAlias) => reducerAlias.gemini);
	const [message, setMessage] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(message);

		dispatch(promptToGemini(message));
	};

	return (
		<section className="p-4 flex flex-col gap-4">
			<h1 className="text-3xl font-semibold">Home Page</h1>
			<form
				className="flex flex-col gap-4 w-full md:w-1/2 mx-auto"
				onSubmit={handleSubmit}
			>
				<Label htmlFor="prompts">Message</Label>
				<Textarea
					id="prompts"
					label="Message"
					name="message"
					className="h-48"
					onChange={(e) => setMessage(e.target.value)}
					value={message}
				/>
				<Button variant="outline" type="submit">
					Submit
				</Button>
			</form>
			{promptInput && (
				<section className="w-full md:w-1/2 mx-auto">
					<h3 className="text-xl font-semibold">Refined Input:</h3>
					{promptInput}
				</section>
			)}
			{
				// ! Di sini kita akan menampilkan error dari Gemini
				isError && (
					<section className="w-full md:w-1/2 mx-auto">
						<h3 className="text-xl font-semibold">Error:</h3>
						{error}
					</section>
				)
			}
			{
				// ! Di sini kita akan menampilkan response dari Gemini
				!isPending && promptResponse && (
					<section className="w-full md:w-1/2 mx-auto">
						<h3 className="text-xl font-semibold">Response dari Gemini:</h3>
						{promptResponse}
					</section>
				)
			}
		</section>
	);
};

export default HomePage;
