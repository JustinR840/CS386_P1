import React, {Component} from 'react';
import MastermindTableRow from "./MastermindTableRow";
import MastermindTableRowFeedback from "./MastermindTableRowFeedback";


class MastermindTable extends Component
{
	render()
	{
		return (
			<table className="mastermind_table">
				<tbody>
				{
					this.props.mastermindArray.map((row, rowIdx) =>
						<tr key={rowIdx}>
							<MastermindTableRow row={row} rowIdx={rowIdx} handleClick={this.props.handleClick}/>
							<MastermindTableRowFeedback feedbackRow={this.props.feedbackArray[rowIdx - 1]} rowIdx={rowIdx - 1}/>
						</tr>
					)
				}
				</tbody>
			</table>
		);
	}
}


export default MastermindTable;