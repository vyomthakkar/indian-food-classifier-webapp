import './style.css'

import { client } from "@gradio/client";

const formEl = document.getElementById("input-img-form")
const inputEl = document.getElementById("input-img")
const predSpaceEl = document.getElementById("pred-space")

formEl.addEventListener("submit", async (e) => {
	e.preventDefault();
	predSpaceEl.style.display = "flex"
	predSpaceEl.innerHTML = "<h3>Predicting...</h3>"
	console.log(inputEl.files)
	let url = window.URL.createObjectURL(inputEl.files[0]);
	console.log(url)
	const response_0 = await fetch(url);
	console.log(response_0)
	const exampleImage = await response_0.blob();
	console.log(exampleImage)
	
	const app = await client("https://vyomthakkar-indian-food-classifier.hf.space/");
	const result = await app.predict("/predict", [
				exampleImage, 	// blob in 'img' Image component
	]);

	console.log(result.data);

	const confidenceObj = result.data[0].confidences.filter((obj) => obj.label === result.data[0].label)[0]
	console.log(confidenceObj)

	predSpaceEl.innerHTML = `
			<div class="pred-item">
				<img class="input-img-display" src="${url}" />
				<p class="pred-text">
					<span class="pred-label">${result.data[0].label}</span>
					<span class="pred-prob">(${(confidenceObj.confidence * 100).toFixed(2) + "%"})</span>
				</p>
			</div>
	`

})

