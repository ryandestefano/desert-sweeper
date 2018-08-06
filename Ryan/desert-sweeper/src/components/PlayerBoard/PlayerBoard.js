import React from 'react';
import Cell from '../Cell/Cell';

class PlayerBoard extends React.Component {
  constructor(props) {
    super(props);
    this.renderPlayerBoard = this.renderPlayerBoard.bind(this);
  }

  renderPlayerBoard() {
    let playerBoard = this.props.playerBoard.map(row => {
      return (
        <div className='row'>
          {row.map(cell => {
            return (
              <Cell
                row={cell.row}
                column={cell.column}
                isFlagged={cell.isFlagged}
                adjacentBombs={cell.adjacentBombs}
                isRevealed={cell.isRevealed}
                isGem={cell.isGem}
                isObelisk={cell.isObelisk}
                nwRevealed={cell.nwRevealed}
                nRevealed={cell.nRevealed}
                neRevealed={cell.neRevealed}
                eRevealed={cell.eRevealed}
                seRevealed={cell.seRevealed}
                sRevealed={cell.sRevealed}
                swRevealed={cell.swRevealed}
                wRevealed={cell.wRevealed}
                cellClick={this.props.cellClick}
              />
            );
          })}
        </div>
      );
    });
    return playerBoard;
  }

  render() {
    return (
      <div>{this.renderPlayerBoard()}</div>
    );
  }
}

export default PlayerBoard;
