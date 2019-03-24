import React, {Component} from 'react';
import MastermindTableRow from "./MastermindTableRow";
import MastermindTableRowFeedback from "./MastermindTableRowFeedback";


const NUM_GUESSES = 8;

class MastermindTable extends Component
{
	// topRowIsFull()
	// {
	// 	//console.log("checking");
	// 	let has_empty = false;
	// 	this.props.mastermindArray[0].forEach((v) => has_empty = has_empty || v.colorName === "Empty circle");
	// 	return !has_empty;
	// }


	render()
	{
		// let gameIsOver = false;
		//
		// if (this.topRowIsFull())
		// {
		// 	console.log("Top row is full.");
		// 	this.props.addNewFeedbackRow();
		// 	if (this.props.mastermindArray.length === NUM_GUESSES)
		// 	{
		// 		console.log("Game Over");
		// 		gameIsOver = true;
		// 	}
		// 	else
		// 	{
		// 		this.props.addNewRow();
		// 	}
		// }

		return (
			<table className="mastermind_table">
				<tbody>
				{
					this.props.mastermindArray.map((row, rowIdx) =>
						<tr key={rowIdx}>
							<MastermindTableRow row={row} rowIdx={rowIdx} handleClick={this.props.handleClick}/>
							{/*<MastermindTableRowFeedback row={row} rowIdx={rowIdx} gameIsOver={gameIsOver} winningColorsArray={this.props.winningColorsArray} feedbackArray={this.props.feedbackArray}/>*/}
							<MastermindTableRowFeedback feedbackRow={this.props.feedbackArray[rowIdx - 1]} rowIdx={rowIdx - 1} totalLength={this.props.feedbackArray.length}/>
						</tr>
					)
				}
				</tbody>
			</table>
		);
	}
}


export default MastermindTable;