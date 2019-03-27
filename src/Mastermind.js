import React, {Component} from 'react';
import './Mastermind.css';


const red = require('./images/redCircle.png');
const blue = require('./images/blueCircle.png');
const green = require('./images/greenCircle.png');
const purple = require('./images/purpleCircle.png');
const teal = require('./images/tealCircle.png');
const magenta = require('./images/magentaCircle.png');
const emptyCircle = require('./images/emptyCircle.png');


// Number of guesses the player is allowed to make.
const NUM_GUESSES = 8;
// Enum used to determine if the game is over or not.
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
			statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
			showWinningCircles: true,
			gameState: GAME_STATE.GAME_IN_PROGRESS
		};

		this.toggleWinningRowVisibility = this.toggleWinningRowVisibility.bind(this);
	}


	componentDidMount()
	{

	}


	// The heavy lifting part of the program. Executes when the user clicks
	// one of the guess circles. The method will first change the color of the
	// clicked guess circle. If there are still empty circles in the row then the
	// function will just update the state with the newly color circle and exit.
	// If there are no more empty circles then the method will generate the feedback
	// circles for the completed guess row. Then it will check if all of the circles
	// are red, indicating a win. If they are not all red it then checks if the player
	// has remaining guesses and if not ends the game. Finally if they are not
	// all red and the player still has more guesses it will add a new, empty guess row.
	// It will then update the state and exit.
	handleTopGuessRowClick(props)
	{
		// We're only ever processing clicks for the top row, which is index 0.
		let rowIdx = 0;

		// We'll possibly be updating these so make a copy.
		let newShowWinningCircles = this.state.showWinningCircles;
		let newGameState = GAME_STATE.GAME_IN_PROGRESS;

		// Make a copy of the board so we can make some modifications.
		let newBoard = JSON.parse(JSON.stringify(this.state.mastermindArray));
		// Also make a copy of the feedback array, even though we may not modify it.
		let newFeedbackArray = JSON.parse(JSON.stringify(this.state.feedbackArray));

		// Set the color for the clicked circle
		newBoard[rowIdx][props.colIdx].color = this.state.statusCircle.color;
		newBoard[rowIdx][props.colIdx].colorName = this.state.statusCircle.colorName;

		// Check if the top row is filled now.
		let top_row_filled = true;
		newBoard[0].forEach((v) => top_row_filled = top_row_filled && v.colorName !== "Empty circle");

		// If the top row is full, check if game is over or do stuff to add a new row.
		if(top_row_filled)
		{
			// Create the feedback circles for the most recently completed row.
			let newFeedbackRow = this.createNewFeedbackRow({row: newBoard[0], winningColors: this.state.winningColorsArray});

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
			// Add in a new row to mastermindArray, giving the player another guess.
			else
			{
				let newGuessRow = Array(4).fill(JSON.parse(JSON.stringify(this.nonFilledCircle)));

				// Unshift will put the newGuessRow at the beginning of the newBoard array.
				newBoard.unshift(newGuessRow);
			}
		}

		// Finally, update the state.
		this.setState({mastermindArray: newBoard, feedbackArray: newFeedbackArray, showWinningCircles: newShowWinningCircles, gameState: newGameState});
	}


	// Takes a guess row and the winning color combination and
	// figures out the associated feedback row.
	createNewFeedbackRow(props)
	{
		let numberCorrectSpots = 0;
		let numberCorrectColors = 0;

		let guess_color_used = [false, false, false, false];
		let secret_color_used = [false, false, false, false];

		for(let i = 0; i < props.winningColors.length; i++)
		{
			if(props.winningColors[i].colorName === props.row[i].colorName)
			{
				guess_color_used[i] = secret_color_used[i] = true;
				numberCorrectSpots += 1;
			}
		}

		for(let i = 0; i < props.row.length; i++)
		{
			if(!guess_color_used[i])
			{
				for(let j = 0; j < props.winningColors.length; j++)
				{
					if(!secret_color_used[j] && props.winningColors[j].colorName === props.row[i].colorName)
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


	// Changes the currently selected palette color.
    handlePaletteCircleClick(circle)
	{
		this.setState({statusCircle: circle});
	}


	// Gets a random number between low (inclusive) and high (inclusive).
	getRandomIdx(low, high)
	{
		return Math.floor(Math.random() * (high - low + 1) + low);
	}


	// Resets the game. New winning circles are randomly chosen, the mastermindArray and
	// feedbackArray are reset. The gameState is reset. The status circle is reset.
	// The showWinningCircles option is NOT reset.
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
			gameState: GAME_STATE.GAME_IN_PROGRESS
		});
	}


	// Used by the "Show Winning Circles" checkbox. Toggles whether or not the
	// winning circles should be visible.
	// NOTE: Winning circles are forced to be visible when the game ends.
	toggleWinningRowVisibility(event)
	{
		this.setState({showWinningCircles: event.target.checked});
	}


	// Opens a link to the Wikipedia page on Mastermind.
	howToPlay()
	{
		window.open("https://en.wikipedia.org/wiki/Mastermind_(board_game)#Gameplay_and_rules", "_blank");
	}


	// Contains the "Reset Game" button, "How to Play" button, and "Show Winning Circles" checkbox.
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


	// The very top two circles on the screen. The left red circle does nothing.
	// The right circle shows the currently selected palette color.
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


	// The randomly chosen winning combination of circeles. This is only displayed
	// if the user has checked the "Show Winning Circles" checkbox.
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


	// The color selection palette. Contains the circles that the user clicks on to select
	// a color that they can later use to click on the guess circles to set the guess circle
	// to the currently selected palette color.
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


	// The table that holds the player guesses and feedback circles. Special logic for
	// the mastermindTableFeedbackRow because it's offset by 1 from the current
	// mastermindTableRow unless the game is over.
	mastermindTable()
	{
		return (
			<table className="mastermind_table">
				<tbody>
				{
					this.state.mastermindArray.map((row, rowIdx) =>
						<tr key={rowIdx}>
							{this.mastermindTableRow({row: row, rowIdx: rowIdx})}
							{this.mastermindTableRowFeedback({feedbackRow: this.state.gameState === GAME_STATE.GAME_OVER ? this.state.feedbackArray[rowIdx] : this.state.feedbackArray[rowIdx - 1],
							rowIdx: this.state.gameState === GAME_STATE.GAME_OVER ? rowIdx : rowIdx - 1})}
						</tr>
					)
				}
				</tbody>
			</table>
		);
	}


	// Creates the clickable circles in a single guess row. These are the circles that the player
	// chooses colors for as their guess. The onClick for each is only set if it is the top row and
	// the game is not over.
	mastermindTableRow(props)
	{
		return (
			props.row.map((circle, colIdx) =>
				<td key={colIdx} onClick={props.rowIdx === 0 && this.state.gameState !== GAME_STATE.GAME_OVER ? () => this.handleTopGuessRowClick({colIdx: colIdx}) : undefined}>
					<img className="large_circle" src={circle.color} alt={circle.colorName}/>
				</td>
			)
		);
	}


	// Creates the feedback circles from the feedbackArray (which gets its data
	// from createFeedbackRow).
	mastermindTableRowFeedback(props)
	{
		// For when we don't have any feedback rows (the game has just started).
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


	// End of game text that shows whether the player won or lost.
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
				<div style={{height: 136 + (NUM_GUESSES * 58) - (this.state.mastermindArray.length * 58) - (this.state.showWinningCircles * 60) - (this.state.gameState === GAME_STATE.GAME_OVER ? 21 : 0) + "px"}}>&nbsp;</div>
				{this.mastermindTable()}
				{this.mastermindPalette()}

			</div>
		);
	}
}


export default Mastermind;
