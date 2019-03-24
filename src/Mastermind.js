import React, {Component} from 'react';
import './Mastermind.css';

import MastermindTable from './MastermindTable'


const red = require('./images/redCircle.png');
const blue = require('./images/blueCircle.png');
const green = require('./images/greenCircle.png');
const purple = require('./images/purpleCircle.png');
const teal = require('./images/tealCircle.png');
const magenta = require('./images/magentaCircle.png');
const emptyCircle = require('./images/emptyCircle.png');


const NUM_GUESSES = 8;

class Mastermind extends Component
{

	paletteColors = [
		{color: green, colorName: 'Green'},
		{color: teal, colorName: 'Teal'},
		{color: magenta, colorName: 'Magenta'},
		{color: blue, colorName: 'Blue'},
		{color: red, colorName: 'Red'},
		{color: purple, colorName: 'Purple'}
	];

	nonFilledCircle = {
		color: emptyCircle,
		colorName: 'Empty circle'
	};


	constructor(props)
	{
		super(props);

		let emptyRow = [
			this.nonFilledCircle,
			this.nonFilledCircle,
			this.nonFilledCircle,
			this.nonFilledCircle
		];

		let winning_colors = [
			this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)],
			this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)],
			this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)],
			this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)]
		];

		this.state = {
			mastermindArray: [emptyRow],
			feedbackArray: [],
			winningColorsArray: winning_colors,
			statusCircle: {color: emptyCircle, colorName: 'Empty circle'}
		};

		this.handleClick = this.handleClick.bind(this);
		this.addNewRow = this.addNewRow.bind(this);
		this.addNewFeedbackRow = this.addNewFeedbackRow.bind(this);
	}


	componentDidMount()
	{

	}


	selectedPaletteCircle(circle)
	{
		//console.log('selected a palette color', circle.colorName);
		this.setState({statusCircle: circle});
	}


	getRandomIdx(low, high)
	{

		return Math.floor(Math.random() * (high - low + 1) + low);
	}


	paletteCircles()
	{
		return (
			<table className="palette_circles">
				<tbody>
					<tr>
						{
							this.paletteColors.map((paletteElement, idx) =>
								<td key={idx} onClick={() => this.selectedPaletteCircle(paletteElement)}>
									<img className="large_circle" src={paletteElement.color} alt={paletteElement.colorName}/>
								</td>
							)
						}
					</tr>
				</tbody>
			</table>
		);
	}


	statusRow()
	{
		let {
			color,
			colorName
		} = this.state.statusCircle;

		return (
			<table className="status_circles">
				<tbody>
					<tr>
						<td>
							<img className="large_circle" src={red} alt="red circle"/>
						</td>
						<td>
							<img className="large_circle" src={color} alt={colorName}/>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}


	handleClick(rowIdx, colIdx)
	{
		// Only process clicks for the top row. Should probably just not put onClicks in rows that aren't the top.
		if(rowIdx !== 0)
		{
			return;
		}

		// Make a copy of the board so we can make some modifications.
		let newBoard = JSON.parse(JSON.stringify(this.state.mastermindArray));
		// Also make a copy of the feedback array, even though we may not modify it.
		let newFeedbackArray = JSON.parse(JSON.stringify(this.state.feedbackArray));

		// Set the color for the clicked circle
		newBoard[rowIdx][colIdx].color = this.state.statusCircle.color;
		newBoard[rowIdx][colIdx].colorName = this.state.statusCircle.colorName;

		// Check if the top row is filled now.
		let has_empty = false;
		newBoard[0].forEach((v) => has_empty = has_empty || v.colorName === "Empty circle");

		// If the top row is full, do stuff to add a new row.
		if(!has_empty)
		{
			// Create the feedback circles for the most recently completed row.
			let newFeedbackRow = [];

			let numCorrectSpots = 0;
			newBoard[0].forEach((v, idx) => numCorrectSpots += v.colorName === this.state.winningColorsArray[idx].colorName ? 1 : 0);

			console.log("Num Correct Spots: " + numCorrectSpots);

			for(let i = 0; i < 4; i++)
			{
				// Add as many red circles as needed.
				if(i < numCorrectSpots)
				{
					newFeedbackRow.push({
						color: red,
						colorName: 'Red'
					});
				}
				// The rest are empty circles.
				else
				{
					newFeedbackRow.push({
						color: emptyCircle,
						colorName: 'Empty circle'
					});
				}
			}

			newFeedbackArray.unshift(newFeedbackRow);


			// Now add in a new row to the mastermindArray, but only if we haven't exceeded the max number of guesses.
			if(newBoard.length < NUM_GUESSES)
			{
				let newGuessRow = Array(4).fill(JSON.parse(JSON.stringify(this.nonFilledCircle)));

				// Unshift will put the newGuessRow at the beginning of the newBoard array.
				newBoard.unshift(newGuessRow);
			}
		}

		// Finally, update the state with the new board and (possible new) feedback.
		this.setState({mastermindArray: newBoard, feedbackArray: newFeedbackArray});
	}


	addNewRow()
	{
		let emptyRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];

		let newBoard = JSON.parse(JSON.stringify(this.state.mastermindArray));
		newBoard.unshift(emptyRow);

		this.setState({mastermindArray: newBoard});
	}


	addNewFeedbackRow()
	{
		let emptyRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];

		let numCorrectSpots = 0;
		this.state.mastermindArray[0].forEach((v, idx) => numCorrectSpots += v.colorName === this.state.winningColorsArray[idx].colorName ? 1 : 0);

		console.log("Num Correct Spots: " + numCorrectSpots);

		for(let i = 0; i < numCorrectSpots; i++)
		{
			emptyRow[i].color = red;
			emptyRow[i].colorName = "Red";
		}

		let newBoard = JSON.parse(JSON.stringify(this.state.feedbackArray));
		newBoard.unshift(emptyRow);

		this.setState({feedbackArray: newBoard});
	}


	winningRow()
	{
		return (
			<table className="winning_row">
				<tbody>
					<tr>
						{
							this.state.winningColorsArray.map((v, idx) =>
								<td key={idx}>
									<img className="large_circle" src={v.color} alt={v.colorName}/>
								</td>
							)
						}
					</tr>
				</tbody>
			</table>
		);
	}


	render()
	{
		return (
			<div className="Mastermind">
				{this.statusRow()}
				{this.winningRow()}
				<div style={{height: "400px"}}>&nbsp;</div>
				<MastermindTable mastermindArray={this.state.mastermindArray} feedbackArray={this.state.feedbackArray} winningColorsArray={this.state.winningColorsArray} handleClick={this.handleClick} addNewRow={this.addNewRow} addNewFeedbackRow={this.addNewFeedbackRow}/>
				{this.paletteCircles()}

			</div>
		);
	}
}


export default Mastermind;
