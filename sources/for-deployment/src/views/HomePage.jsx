import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { promptToGemini } from "@/features/gemini-slice";
import { useDispatch, useSelector } from "react-redux";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GITHUB_REPO } from "@/constants";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";

import Markdown from "markdown-to-jsx";

const HomePage = () => {
	// ? Di sini kita akan menggunakan package react-hook-form untuk handle dan validasi form
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();
	const { promptInput, promptResponse, isError, error, isPending } =
		useSelector((reducerAlias) => reducerAlias.gemini);

	// ? Di sini kita akan membuat function untuk menghandle submit form
	// ? By default dari react-hook-form, kita akan mendapatkan data dari form
	// ? Dan sudah event.preventDefault() secara otomatis
	const handleSubmitToDispatchGemini = (data) => {
		const apiKey = data.apiKey;
		const feedInput = data.message;

		dispatch(promptToGemini(apiKey, feedInput));
	};

	return (
		<main className="p-4 flex flex-col gap-4">
			<nav className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold">Home Page</h1>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline">About</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="text-xl">
								Created By: <p>withered-flowers - 2024</p>
							</AlertDialogTitle>
							<AlertDialogDescription className="text-lg">
								To see the full code, See:&nbsp;
								<a
									href={GITHUB_REPO}
									className="underline text-blue-400 hover:text-blue-400/80 transition-colors duration-300"
								>
									Github Repo
								</a>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogAction>Close</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</nav>
			<form
				className="flex flex-col gap-4 w-full md:w-1/2 mx-auto"
				onSubmit={handleSubmit(handleSubmitToDispatchGemini)}
			>
				<Label htmlFor="apiKey">
					API Key<span className="text-red-400">*</span>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<a
									href="https://aistudio.google.com/app/prompts/new_chat?pli=1"
									className="text-blue-400 cursor-pointer mx-1"
								>
									-&gt; ? &lt;-
								</a>
							</TooltipTrigger>
							<TooltipContent>
								<p>API Key from Gemini</p>
								<p>
									You can get it from:
									https://aistudio.google.com/app/prompts/new_chat?pli=1
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Label>
				<Input
					id="apiKey"
					name="apiKey"
					type="text"
					placeholder="API Key"
					{...register("apiKey", { required: true })}
					aria-invalid={errors.apiKey ? "true" : "false"}
				/>

				{errors.apiKey?.type === "required" && (
					<p role="alert" className="text-red-400 animate-pulse">
						API Key tidak boleh kosong
					</p>
				)}

				<Label htmlFor="prompts">
					Message Prompt<span className="text-red-400">*</span>
				</Label>
				{/* // ? Tidak perlu menggunakan useState, cukup register saja */}
				{/* // ? Untuk validasi gunakan prop aria-invalid, kemudian dilanjutkan dengan errors.<nama_register>  */}
				<Textarea
					id="prompts"
					label="Message"
					name="message"
					className="h-48"
					{...register("message", { required: true })}
					aria-invalid={errors.message ? "true" : "false"}
				/>

				{/* // ? Di sini kita akan menampilkan error dari react-hook-form */}
				{errors.message?.type === "required" && (
					<p role="alert" className="text-red-400 animate-pulse">
						Message Prompt tidak boleh kosong
					</p>
				)}

				<Button variant="outline" type="submit">
					Submit
				</Button>
			</form>

			{promptInput && (
				<section className="w-full md:w-1/2 mx-auto">
					<h3 className="text-xl font-semibold">Refined Input:</h3>
					<p className="my-4">{promptInput}</p>
				</section>
			)}

			{isPending && (
				<section className="flex flex-col gap-4 w-full md:w-1/2 mx-auto">
					<Skeleton className="h-8 w-[13rem]" />
					<Skeleton className="h-16" />
				</section>
			)}

			{
				// ! Di sini kita akan menampilkan error dari Gemini
				isError && (
					<section className="w-full md:w-1/2 mx-auto">
						<h3 className="text-xl font-semibold">Error:</h3>
						<p className="text-red-400 font-semibold">
							{error?.errorDetails[0]?.reason}
						</p>
					</section>
				)
			}
			{
				// ! Di sini kita akan menampilkan response dari Gemini
				!isPending && promptResponse && (
					<section className="w-full md:w-1/2 mx-auto">
						<h3 className="text-xl font-semibold">Response dari Gemini:</h3>
						<section className="prose max-width-full">
							<Markdown>{promptResponse}</Markdown>
						</section>
					</section>
				)
			}
		</main>
	);
};

export default HomePage;
