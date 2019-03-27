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
const GAME_STATE = {
	GAME_OVER: 1,
	GAME_IN_PROGRESS: 2
};

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

		// let winning_colors = [
		// 	this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)],
		// 	this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)],
		// 	this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)],
		// 	this.paletteColors[this.getRandomIdx(0, this.paletteColors.length - 1)]
		// ];

		let winning_colors = [
			this.paletteColors[0],
			this.paletteColors[0],
			this.paletteColors[0],
			this.paletteColors[0]
		];

		this.state = {
			mastermindArray: [emptyRow],
			feedbackArray: [],
			winningColorsArray: winning_colors,
			statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
			showWinningCircles: true,
			gameState: GAME_STATE.GAME_IN_PROGRESS
		};

		this.toggleWinningRowVisibility = this.toggleWinningRowVisibility.bind(this);
	}


	componentDidMount()
	{

	}


	// rowIdx should always be 0.
	handleClick(rowIdx, colIdx)
	{
		// Only process clicks for the top row.
		// TODO: Should probably just not put onClicks in rows that aren't the top.
		if(rowIdx !== 0 || this.state.gameState === GAME_STATE.GAME_OVER)
		{
			return;
		}

		// We'll possibly be updating these so make a copy.
		let newShowWinningCircles = this.state.showWinningCircles;
		let newGameState = GAME_STATE.GAME_IN_PROGRESS;

		// Make a copy of the board so we can make some modifications.
		let newBoard = JSON.parse(JSON.stringify(this.state.mastermindArray));
		// Also make a copy of the feedback array, even though we may not modify it.
		let newFeedbackArray = JSON.parse(JSON.stringify(this.state.feedbackArray));

		// Set the color for the clicked circle
		newBoard[rowIdx][colIdx].color = this.state.statusCircle.color;
		newBoard[rowIdx][colIdx].colorName = this.state.statusCircle.colorName;

		// Check if the top row is filled now.
		let top_row_filled = true;
		newBoard[0].forEach((v) => top_row_filled = top_row_filled && v.colorName !== "Empty circle");

		// If the top row is full, do stuff to add a new row.
		if(top_row_filled)
		{
			// Create the feedback circles for the most recently completed row.
			let newFeedbackRow = this.createNewFeedbackRow(newBoard[0], this.state.winningColorsArray);

			newFeedbackArray.unshift(newFeedbackRow);

			// Check the feedback row to see if they're all red circles (and the length is correct), indicating a win.
			let all_are_red = true;
			newFeedbackRow.map((v) => all_are_red = all_are_red && v.colorName === "Red");
			all_are_red = all_are_red && newFeedbackRow.length === this.state.winningColorsArray.length;

			// Check if game is over.
			if(all_are_red || newBoard.length === NUM_GUESSES)
			{
				newShowWinningCircles = true;
				newGameState = GAME_STATE.GAME_OVER;
			}
			// Now add in a new row to the mastermindArray, but only if we haven't exceeded the max number of guesses.
			else if(newBoard.length < NUM_GUESSES)
			{
				let newGuessRow = Array(4).fill(JSON.parse(JSON.stringify(this.nonFilledCircle)));

				// Unshift will put the newGuessRow at the beginning of the newBoard array.
				newBoard.unshift(newGuessRow);
			}
		}

		// Finally, update the state with the new board and (possible new) feedback.
		this.setState({mastermindArray: newBoard, feedbackArray: newFeedbackArray, showWinningCircles: newShowWinningCircles, gameState: newGameState});
	}


	createNewFeedbackRow(row, winningColors)
	{
		let numberCorrectSpots = 0;
		let numberCorrectColors = 0;

		let guess_color_used = [false, false, false, false];
		let secret_color_used = [false, false, false, false];

		for(let i = 0; i < winningColors.length; i++)
		{
			if(winningColors[i].colorName === row[i].colorName)
			{
				guess_color_used[i] = secret_color_used[i] = true;
				numberCorrectSpots += 1;
			}
		}

		for(let i = 0; i < row.length; i++)
		{
			if(!guess_color_used[i])
			{
				for(let j = 0; j < winningColors.length; j++)
				{
					if(!secret_color_used[j] && winningColors[j].colorName === row[i].colorName)
					{
						secret_color_used[j] = true;
						numberCorrectColors += 1;
						break
					}
				}
			}
		}

		let newFeedbackRow = [];

		// Add as many red circles as needed.
		for(let i = 0; i < numberCorrectSpots; i++)
		{
			newFeedbackRow.push({
				color: red,
				colorName: 'Red'
			});
		}

		// Add as many white circles as needed.
		for(let i = 0; i < numberCorrectColors; i++)
		{
			newFeedbackRow.push({
				color: emptyCircle,
				colorName: 'Empty circle'
			});
		}

		return newFeedbackRow;
	}


    handlePaletteCircleClick(circle)
	{
		this.setState({statusCircle: circle});
	}


	getRandomIdx(low, high)
	{
		return Math.floor(Math.random() * (high - low + 1) + low);
	}


	resetGame()
	{
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

		this.setState({
			mastermindArray: [emptyRow],
			feedbackArray: [],
			winningColorsArray: winning_colors,
			statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
			showWinningCircles: this.state.showWinningCircles,
			gameState: GAME_STATE.GAME_IN_PROGRESS
		});
	}


	toggleWinningRowVisibility(event)
	{
		this.setState({showWinningCircles: event.target.checked});
	}


	howToPlay()
	{
		window.open("https://en.wikipedia.org/wiki/Mastermind_(board_game)#Gameplay_and_rules", "_blank");
	}


	controlRow()
	{
		return (
			<div>
				<button onClick={() => this.resetGame()}>Reset Game</button>
				<button onClick={() => this.howToPlay()}>How To Play</button>
				<br/>
				<label>Show Winning Circles<input type="checkbox" name="showWinningCircles" checked={this.state.showWinningCircles} onChange={this.toggleWinningRowVisibility}/></label>
			</div>
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


	winningRow()
	{
		if(this.state.showWinningCircles)
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
	}


	mastermindPalette()
	{
		return (
			<table className="palette_circles">
				<tbody>
					<tr>
						{
							this.paletteColors.map((paletteElement, idx) =>
								<td key={idx} onClick={() => this.handlePaletteCircleClick(paletteElement)}>
									<img className="large_circle" src={paletteElement.color} alt={paletteElement.colorName}/>
								</td>
							)
						}
					</tr>
				</tbody>
			</table>
		);
	}


	mastermindTable()
	{
		return (
			<table className="mastermind_table">
				<tbody>
				{
					this.state.mastermindArray.map((row, rowIdx) =>
						<tr key={rowIdx}>
							{this.mastermindTableRow({row: row, rowIdx: rowIdx})}
							{this.mastermindTableRowFeedback({feedbackRow: this.state.feedbackArray[rowIdx], rowIdx: rowIdx})}
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
				<td key={colIdx} onClick={() => this.handleClick(props.rowIdx, colIdx)}>
					<img className="large_circle" src={circle.color} alt={circle.colorName}/>
				</td>
			)
		);
	}


	mastermindTableRowFeedback(props)
	{
		// The 'current' row doesn't have a feedback row, so exclude it. TODO: Better comment
		if (props.feedbackRow !== undefined)
		{
			return (
				<td key={props.rowIdx}>
					<table>
						<tbody className="feedback_table">
							<tr>
								{props.feedbackRow.length > 0 ? <td key={0}><img className="small_circle" src={props.feedbackRow[0].color} alt={props.feedbackRow[0].colorName}/></td> : <td key={0}/>}
								{props.feedbackRow.length > 1 ? <td key={1}><img className="small_circle" src={props.feedbackRow[1].color} alt={props.feedbackRow[1].colorName}/></td> : <td key={1}/>}
							</tr>
							<tr>
								{props.feedbackRow.length > 2 ? <td key={2}><img className="small_circle" src={props.feedbackRow[2].color} alt={props.feedbackRow[2].colorName}/></td> : <td key={2}/>}
								{props.feedbackRow.length > 3 ? <td key={3}><img className="small_circle" src={props.feedbackRow[3].color} alt={props.feedbackRow[3].colorName}/></td> : <td key={3}/>}
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


	endGameText()
	{
		if(this.state.gameState === GAME_STATE.GAME_OVER)
		{
			// Check the feedback row to see if they're all red circles (and the length is correct), indicating a win.
			let all_are_red = true;
			this.state.feedbackArray[0].map((v) => all_are_red = all_are_red && v.colorName === "Red");
			all_are_red = all_are_red && this.state.feedbackArray[0].length === this.state.winningColorsArray.length;

			if(all_are_red)
			{
				return (<b>You Win!</b>);
			}
			else
			{
				return (<b>You Lose!</b>);
			}
		}
	}


	render()
	{
		return (
			<div className="Mastermind">
				{this.statusRow()}
				{this.controlRow()}
				{this.winningRow()}
				{this.endGameText()}
				<div style={{height: 600 - (this.state.mastermindArray.length * 58) - (this.state.showWinningCircles * 60) - (this.state.gameState === GAME_STATE.GAME_OVER ? 21 : 0) + "px"}}>&nbsp;</div>
				{this.mastermindTable()}
				{this.mastermindPalette()}

			</div>
		);
	}
}


export default Mastermind;
