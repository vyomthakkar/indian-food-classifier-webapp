import './style.css'

import { client } from "@gradio/client";

const formEl = document.getElementById("input-img-form")
const inputEl = document.getElementById("input-img")
const imgEl = document.getElementById("input-img-display")
const predSpaceEl = document.getElementById("pred-space")
const predLabelEl = document.getElementById("pred-label")
const predProbEl = document.getElementById("pred-prob")

formEl.addEventListener("submit", async (e) => {
	e.preventDefault();
	predLabelEl.textContent = ""
	predProbEl.textContent = ""
	predSpaceEl.style.display = "flex"
	console.log(inputEl.files)
	let url = window.URL.createObjectURL(inputEl.files[0]);
	console.log(url)
	imgEl.src = url
	const response_0 = await fetch(url);
	console.log(response_0)
	const exampleImage = await response_0.blob();
	console.log(exampleImage)
	
	const app = await client("https://vyomthakkar-indian-food-classifier.hf.space/");
	const result = await app.predict("/predict", [
				exampleImage, 	// blob in 'img' Image component
	]);

	console.log(result.data);

	predLabelEl.textContent = result.data[0].label
	const confidenceObj = result.data[0].confidences.filter((obj) => obj.label === result.data[0].label)[0]
	console.log(confidenceObj)
	predProbEl.textContent = `(${(confidenceObj.confidence * 100).toFixed(2) + "%"})`

})

