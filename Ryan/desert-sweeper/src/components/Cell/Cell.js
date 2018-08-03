import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.cellClassNames = this.cellClassNames.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  cellClassNames() {
    let className = 'cell';
    if (this.props.isFlagged) {
      className += ' flagged';
    }
    if (this.props.isRevealed) {
      className += ` cell-${this.props.adjacentBombs}`;
    }
    if (this.props.nwRevealed) {
      className += ' nw-revealed';
    }
    if (this.props.nRevealed) {
      className += ' n-revealed';
    }
    if (this.props.neRevealed) {
      className += ' ne-revealed';
    }
    if (this.props.eRevealed) {
      className += ' e-revealed';
    }
    if (this.props.seRevealed) {
      className += ' se-revealed';
    }
    if (this.props.sRevealed) {
      className += ' s-revealed';
    }
    if (this.props.swRevealed) {
      className += ' sw-revealed';
    }
    if (this.props.wRevealed) {
      className += ' w-revealed';
    }
    return className;
  }

  handleCellClick(e) {
    this.props.cellClick(e, this.props.row, this.props.column);
  }

  render() {
    return (
      <div className={this.cellClassNames()} onClick={this.handleCellClick}>
        <span>{this.props.isRevealed ? this.props.adjacentBombs : '' }</span>
      </div>
    );
  }
}

export default Cell;
