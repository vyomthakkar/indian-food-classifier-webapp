import './style.css'

import { client } from "@gradio/client";

const formEl = document.getElementById("input-img-form")
const inputEl = document.getElementById("input-img")
const predSpaceEl = document.getElementById("pred-space")

//creates a dom element for a particular prediction object/unit (img + class + class prob)
const createDomPredItem = (url, label, confidenceObj) => {

	//create the parent pred item div that contains child items. this element will be eventually returned by the function
	const predItemEl = document.createElement("div")
	predItemEl.classList.add("pred-item")

	//first child of pred item elem. imgEl contains the image on which to perform inference
	const imgEl = document.createElement("img")
	imgEl.classList.add("input-img-display")
	imgEl.setAttribute("src", `${url}`)
	predItemEl.appendChild(imgEl)

	//second child of pred item. this item in turn contains 2 child span elements (pred label and preb prob). 
	const predTextEl = document.createElement("p")
	predTextEl.classList.add("pred-text")
	const predLabelEl = document.createElement("span")
	predLabelEl.classList.add("pred-label")
	predLabelEl.textContent = label
	const predProbEl = document.createElement("span")
	predProbEl.classList.add("pred-prob")
	predProbEl.textContent = `  (${(confidenceObj.confidence * 100).toFixed(2) + "%"})`
	predTextEl.appendChild(predLabelEl)
	predTextEl.appendChild(predProbEl)
	predItemEl.appendChild(predTextEl)

	return predItemEl
}

//event listener that triggers when user submits the form
formEl.addEventListener("submit", async (e) => {
	e.preventDefault();
	predSpaceEl.style.display = "flex" //in css file pred-space has display set to none. when we need to make predictions, we set its display to flex
	predSpaceEl.innerHTML = "<h3>Predicting...</h3>"

	const predElems = []
	//iterate through files(images) that have been submitted by the user
	for (const file of inputEl.files) {
		const url = window.URL.createObjectURL(file);
		
		const response_0 = await fetch(url);
		const exampleImage = await response_0.blob();
		
		//user hf space endpoint for inference
		const app = await client("https://vyomthakkar-indian-food-classifier.hf.space/");
		const result = await app.predict("/predict", [
					exampleImage, 	// blob in 'img' Image component
		]);

		//extract label and confidence object from inference response
		const label = result.data[0].label
		const confidenceObj = result.data[0].confidences.filter((obj) => obj.label === result.data[0].label)[0]

		//create dom element from image url, label and confidence. will append to pred-space html element once all predictions are complete
		const predItemEl = createDomPredItem(url, label, confidenceObj)
		predElems.push(predItemEl)

	}
	
	predSpaceEl.innerHTML = "" //clear Predicting... h3 element
	//append predictItemEls to predSpaceEl html element
	for (const el of predElems) {
		predSpaceEl.appendChild(el)
	}

})

