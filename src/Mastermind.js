import React, {Component} from 'react';
import './Mastermind.css';


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
		this.handlePaletteCircleClick = this.handlePaletteCircleClick.bind(this);
	}


	componentDidMount()
	{

	}


	// rowIdx should always be 0.
	handleClick(rowIdx, colIdx)
	{
		// Only process clicks for the top row.
		// TODO: Should probably just not put onClicks in rows that aren't the top.
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
			let newFeedbackRow = this.createNewFeedbackRow(newBoard[0], this.state.winningColorsArray);

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


	createNewFeedbackRow(row, winningColors)
	{
		let newFeedbackRow = [];

		let numCorrectSpots = this.getNumberOfCorrectSpots(row, winningColors);
		let numCorrectColors = this.getNumberOfCorrectColors(row, winningColors);

		for(let i = 0; i < numCorrectSpots; i++)
		{
			// Add as many red circles as needed.
			if(i < numCorrectSpots)
			{
				newFeedbackRow.push({
					color: red,
					colorName: 'Red'
				});
			}
		}

		for(let i = 0; i < numCorrectColors; i++)
		{
			// Add as many white circles as needed.
			if(i < numCorrectColors)
			{
				newFeedbackRow.push({
					color: emptyCircle,
					colorName: 'Empty circle'
				});
			}
		}

		return newFeedbackRow;
	}


	getNumberOfCorrectSpots(row, winningColors)
	{
		let numCorrectSpots = 0;
		row.forEach((v, idx) => numCorrectSpots += v.colorName === winningColors[idx].colorName ? 1 : 0);

		return numCorrectSpots;
	}


	getNumberOfCorrectColors(row, winningColors)
	{
		return 0;
	}


    handlePaletteCircleClick(circle)
	{
		this.setState({statusCircle: circle});
	}


	getRandomIdx(low, high)
	{
		return Math.floor(Math.random() * (high - low + 1) + low);
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


	mastermindPalette(props)
	{
		return (
			<table className="palette_circles">
				<tbody>
				<tr>
					{
						props.paletteColors.map((paletteElement, idx) =>
							<td key={idx} onClick={() => props.handlePaletteCircleClick(paletteElement)}>
								<img className="large_circle" src={paletteElement.color} alt={paletteElement.colorName}/>
							</td>
						)
					}
				</tr>
				</tbody>
			</table>
		);
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


	mastermindTableRowFeedback(props)
	{
		// The 'current' row doesn't have a feedback row, so exclude it.
		if (props.rowIdx >= 0)
		{
			return (
				<td key={props.rowIdx}>
					<table>
						<tbody className="feedback_table">
						<tr>
							{
								props.feedbackRow.map((circle, idx) =>
									<td key={idx}><img className="small_circle" src={circle.color} alt={circle.colorName}/></td>
								)
							}
						</tr>
						</tbody>
					</table>
				</td>
			);
		}
		else
		{
			return <td key={this.props.rowIdx}></td>
		}
	}


	mastermindTable(props)
	{
		return (
			<table className="mastermind_table">
				<tbody>
				{
					props.mastermindArray.map((row, rowIdx) =>
						<tr key={rowIdx}>
							{this.mastermindTableRow({row: row, rowIdx: rowIdx, handleClick: this.handleClick})}
							{this.mastermindTableRowFeedback({feedbackRow: props.feedbackArray[rowIdx - 1], rowIdx: rowIdx - 1})}
						</tr>
					)
				}
				</tbody>
			</table>
		);
	}


	mastermindTableRow(props)
	{
		return (
			props.row.map((circle, colIdx) =>
				<td key={colIdx} onClick={() => props.handleClick(props.rowIdx, colIdx)}>
					<img className="large_circle" src={circle.color} alt={circle.colorName}/>
				</td>
			)
		);
	}


	render()
	{
		return (
			<div className="Mastermind">
				{this.statusRow()}
				{this.winningRow()}
				<div style={{height: 500 - (this.state.mastermindArray.length * 58) + "px"}}>&nbsp;</div>
				{this.mastermindTable({mastermindArray: this.state.mastermindArray, feedbackArray: this.state.feedbackArray, winningColorsArray: this.state.winningColorsArray, handleClick: this.handleClick, addNewRow: this.addNewRow})}
				{this.mastermindPalette({paletteColors: this.paletteColors, handlePaletteCircleClick: this.handlePaletteCircleClick})}

			</div>
		);
	}
}


export default Mastermind;
