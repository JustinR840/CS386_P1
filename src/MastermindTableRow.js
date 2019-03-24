import React, {Component} from 'react';


class MastermindTableRow extends Component
{
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


export default MastermindTableRow;