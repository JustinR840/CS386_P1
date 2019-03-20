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


class MastermindTableRowFeedback extends Component
{

	nonFilledCircle = {
		color: emptyCircle,
		colorName: 'Empty circle'
	};


	constructor(props)
	{
		super(props);
	}


	feedbackCircles()
	{
		if (this.props.rowIdx !== 0 || this.props.gameIsOver === true)
		{
			let feedback = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];


			return (
				<table>
					<tbody className="feedback_table">
						<tr>
							<td>
								<img className="small_circle" src={feedback[0].color} alt={feedback[0].colorName}/>
							</td>
							<td>
								<img className="small_circle" src={feedback[1].color} alt={feedback[1].colorName}/>
							</td>
						</tr>
						<tr>
							<td>
								<img className="small_circle" src={feedback[2].color} alt={feedback[2].colorName}/>
							</td>
							<td>
								<img className="small_circle" src={feedback[3].color} alt={feedback[3].colorName}/>
							</td>
						</tr>
					</tbody>
				</table>
			);
		}
	}


	render()
	{
		return (<td key={this.props.rowIdx}>{this.feedbackCircles()}</td>);
	}
}


class MastermindTableRow extends Component
{
	constructor(props)
	{
		super(props);
	}


	render()
	{
		return (
			this.props.row.map((circle, colIdx) =>
				<td key={colIdx} onClick={() => this.props.handleClick(this.props.rowIdx, colIdx)}>
					<img className="large_circle" src={circle.color} alt={circle.colorName}/>
				</td>
			)
		);
	}
}


class MastermindTable extends Component
{
	constructor(props)
	{
		super(props);
	}


	topRowIsFull()
	{
		console.log("checking");
		let has_empty = false;
		this.props.mastermindArray[0].forEach((v) => has_empty = has_empty || v.colorName === "Empty circle");
		return !has_empty;
	}


	render()
	{

		let gameIsOver = false;

		if (this.topRowIsFull())
		{
			console.log("is full");
			if (this.props.mastermindArray.length === NUM_GUESSES)
			{
				console.log("Game Over");
				gameIsOver = true;
			}
			else
			{
				this.props.addNewRow();
			}
		}

		return (
			<table className="mastermind_table">
				<tbody>
				{
					this.props.mastermindArray.map((row, rowIdx) =>
						<tr key={rowIdx}>
							<MastermindTableRow row={row} rowIdx={rowIdx} handleClick={this.props.handleClick}/>
							<MastermindTableRowFeedback row={row} rowIdx={rowIdx} gameIsOver={gameIsOver}/>
						</tr>
					)
				}
				</tbody>
			</table>
		);
	}
}


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
	}


	componentDidMount()
	{

	}


	selectedPaletteCircle(circle)
	{
		console.log('selected a palette color', circle.colorName);
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
		console.log("Received click at row: " + rowIdx + ", col: " + colIdx);

		let newBoard = JSON.parse(JSON.stringify(this.state.mastermindArray));
		newBoard[rowIdx][colIdx] = this.state.statusCircle;

		this.setState({mastermindArray: newBoard});
	}


	addNewRow()
	{
		let emptyRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];

		let newBoard = JSON.parse(JSON.stringify(this.state.mastermindArray));
		newBoard.unshift(emptyRow);

		this.setState({mastermindArray: newBoard});
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
				<MastermindTable mastermindArray={this.state.mastermindArray} feedbackArray={this.state.feedbackArray} handleClick={this.handleClick} addNewRow={this.addNewRow}/>
				{this.paletteCircles()}

			</div>
		);
	}
}


export default Mastermind;
