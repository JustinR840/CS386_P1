import React, {Component} from 'react';


class MastermindTableRowFeedback extends Component
{
	feedbackCircles()
	{
		// The 'current' row doesn't have a feedback row, so exclude it.
		if (this.props.rowIdx >= 0)
		{
			return (
				<table>
					<tbody className="feedback_table">
						<tr>
							{
								this.props.feedbackRow.map((circle, idx) =>
									<td key={idx}><img className="small_circle" src={circle.color} alt={circle.colorName}/></td>
								)
							}
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


export default MastermindTableRowFeedback;