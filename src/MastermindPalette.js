import React, {Component} from 'react';


class MastermindPalette extends Component
{
	render()
	{
		return (
			<table className="palette_circles">
				<tbody>
				<tr>
					{
						this.props.paletteColors.map((paletteElement, idx) =>
							<td key={idx} onClick={() => this.props.handlePaletteCircleClick(paletteElement)}>
								<img className="large_circle" src={paletteElement.color} alt={paletteElement.colorName}/>
							</td>
						)
					}
				</tr>
				</tbody>
			</table>
		);
	}
}


export default MastermindPalette;