import React from 'react';
import Gem from '../Gem/Gem';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.cellClassNames = this.cellClassNames.bind(this);
    this.renderGem = this.renderGem.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.handleCellHover = this.handleCellHover.bind(this);
    this.handleCellOut = this.handleCellOut.bind(this);
  }

  cellClassNames() {
    let className = 'cell';
    if (this.props.isFlagged) {
      className += ' flagged';
    }
    if (this.props.isRevealed) {
      className += ` cell-${this.props.adjacentBombs}`;
    }
    if (this.props.isRevealed && this.props.isGem) {
      className += ' gem';
    }
    if (this.props.isHovered) {
      className += ' hovered';
    }
    if (this.props.isObelisk) {
      className += ' obelisk';
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

  renderGem() {
    if (this.props.isRevealed && this.props.isGem) {
      console.log('gem');
      return <Gem gemClick={this.props.gemClick} row={this.props.row} column={this.props.column} />;
    }
  }

  handleCellClick(e) {
    this.props.cellClick(e, this.props.row, this.props.column);
  }

  handleCellHover(e) {
    this.props.cellHover(e, this.props.row, this.props.column);
  }

  handleCellOut(e) {
    this.props.cellOut(e, this.props.row, this.props.column);
  }

  render() {
    return (
      <div className={this.cellClassNames()} onClick={this.handleCellClick} onMouseOver={this.handleCellHover} onMouseOut={this.handleCellOut}>
        <span className="top-corners"></span>
        <span className="bottom-corners"></span>
        {this.renderGem()}
        <span className="number">{this.props.isRevealed ? this.props.adjacentBombs : '' }</span>
      </div>
    );
  }
}

export default Cell;
