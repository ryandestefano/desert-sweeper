import React, { Component } from 'react';
import AdjacentCells from '../../util/AdjacentCells';
import ItemPatterns from '../../util/ItemPatterns';
import './App.css';

import PlayerBoard from '../PlayerBoard/PlayerBoard';
import Shop from '../Shop/Shop';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfRows: 16,
      numberOfColumns: 16,
      numberOfBombs: 80,
      numberOfGems: 15,
      numberOfFlags: 0,
      numberOfRevealedCells: 0,
      numberOfDiscoveredGems: 0,
      playerBoard: [],
      cellValue: 5,
      gemValue: 100,
      obeliskCost: 500,
      spentMoney: 0,
      playerMoney: 0,
      bombsAdded: false,
      unresolvedCells: [],
      itemActive: false,
      itemNumber: 1,
      hoverXOffset: 0,
      hoverYOffset: 0
    };
    this.generateBoard = this.generateBoard.bind(this);
    this.getOffsetCells = this.getOffsetCells.bind(this);
    this.addBombs = this.addBombs.bind(this);
    this.addGems = this.addGems.bind(this);
    this.countAdjacentBombs = this.countAdjacentBombs.bind(this);
    this.cellClick = this.cellClick.bind(this);
    this.cellHover = this.cellHover.bind(this);
    this.cellOut = this.cellOut.bind(this);
    this.gemClick = this.gemClick.bind(this);
    this.spendMoney = this.spendMoney.bind(this);
    this.resolveCells = this.resolveCells.bind(this);
    this.increaseRevealedCellsCount = this.increaseRevealedCellsCount.bind(this);
    this.itemActivated = this.itemActivated.bind(this);
  }

  // GENERATE EMPTY BOARD
  generateBoard() {
    let board = [];

    for (let i = 0; i < this.state.numberOfRows; i++) {
      let row = [];

      for (let j = 0; j < this.state.numberOfColumns; j++) {
        row.push({
          row: i,
          column: j,
          isBomb: false,
          isStart: false,
          isGem: false,
          isHovered: false,
          isObelisk: false,
          isFlagged: false,
          isRevealed: false,
          isResolved: false,
          adjacentBombs: 0,
          nwRevealed: false,
          nRevealed: false,
          neRevealed: false,
          eRevealed: false,
          seRevealed: false,
          sRevealed: false,
          swRevealed: false,
          wRevealed: false
        });
      };

      board.push(row);
    };

    this.setState({
      playerBoard: board,
      bombsAdded: false,
      numberOfFlags: 0,
      numberOfRevealedFlags: 0,
      numberOfDiscoveredGems: 0,
      playerMoney: 0,
      spentMoney: 0,
      unresolvedCells: []
    });
    return board;
  }

  // GET OFFSET CELLS
  getOffsetCells(row, column, offsets) {
    let offsetCells = [];

    offsets.forEach(offset => {
      const offsetRow = row + offset[0];
      const offsetColumn = column + offset[1];

      if (offsetRow >= 0 && offsetRow < this.state.numberOfRows && offsetColumn >= 0 && offsetColumn < this.state.numberOfColumns) {
        offsetCells.push([offsetRow, offsetColumn]);
      }
    });

    return offsetCells;
  }

  // ADD BOMBS TO BOARD
  addBombs() {
    let board = this.state.playerBoard;
    let i = 0;

    while (i < this.state.numberOfBombs) {
      const row = Math.floor(Math.random() * this.state.numberOfRows);
      const column = Math.floor(Math.random() * this.state.numberOfColumns);

      if (board[row][column].isBomb === false && board[row][column].isStart === false) {
        board[row][column].isBomb = true;
        i++;
      }
    }
    
    this.setState({playerBoard: board, bombsAdded: true});
    this.countAdjacentBombs();
  }

  // ADD GEMS TO BOARD
  addGems() {
    let board = this.state.playerBoard;
    let i = 0;

    while (i < this.state.numberOfGems) {
      const row = Math.floor(Math.random() * this.state.numberOfRows);
      const column = Math.floor(Math.random() * this.state.numberOfColumns);

      if (board[row][column].isGem === false && board[row][column].isBomb === false && board[row][column].isStart === false) {
        board[row][column].isGem = true;
        i++;
      }
    }
  }

  // COUNT ADJACENT BOMBS
  countAdjacentBombs(row, column) {
    let board = this.state.playerBoard;

    board.forEach(row => {
      row.forEach(cell => {
        let numberOfAdjacentBombs = 0;
        const adjacentCells = this.getOffsetCells(cell.row, cell.column, AdjacentCells);

        adjacentCells.forEach(offsetCell => {
          if (board[offsetCell[0]][offsetCell[1]].isBomb) {
            numberOfAdjacentBombs++;
          }
        });

        cell.adjacentBombs = numberOfAdjacentBombs;
      });
    });

    this.setState({playerBoard: board});
  }

  // COUNT REVEALED CELLS
  increaseRevealedCellsCount() {
    let board = this.state.playerBoard;
    let numberOfRevealedCells = 0;

    board.forEach(row => {
      row.forEach(cell => {

        if (cell.isRevealed) {
          numberOfRevealedCells++;
        }

        // land shape trial
        // NW Check
        if (cell.row > 0 && cell.column > 0 && board[cell.row - 1][cell.column - 1].isRevealed) {
          cell.nwRevealed = true;
        }
        // N Check
        if (cell.row > 0 && board[cell.row - 1][cell.column].isRevealed) {
          cell.nRevealed = true;
        }
        // NE Check
        if (cell.row > 0 && cell.column < this.state.numberOfColumns - 1 && board[cell.row - 1][cell.column + 1].isRevealed) {
          cell.neRevealed = true;
        }
        // E Check
        if (cell.column < this.state.numberOfColumns - 1 && board[cell.row][cell.column + 1].isRevealed) {
          cell.eRevealed = true;
        }
        // SE Check
        if (cell.row < this.state.numberOfRows - 1 && cell.column < this.state.numberOfColumns - 1 && board[cell.row + 1][cell.column + 1].isRevealed) {
          cell.seRevealed = true;
        }
        // S Check
        if (cell.row < this.state.numberOfRows - 1 && board[cell.row + 1][cell.column].isRevealed) {
          cell.sRevealed = true;
        }
        // SW Check
        if (cell.row < this.state.numberOfRows - 1 && cell.column > 0 && board[cell.row + 1][cell.column - 1].isRevealed) {
          cell.swRevealed = true;
        }
        // W Check
        if (cell.column > 0 && board[cell.row][cell.column - 1].isRevealed) {
          cell.wRevealed = true;
        }
      });
    });

    this.setState({numberOfRevealedCells});
  }

  // HANDLE CELL CLICK
  cellClick(e, row, column) {
    let board = this.state.playerBoard;
    let cell = board[row][column];

    // Flag a bomb
    if (e.shiftKey && !cell.isRevealed) {
      if (!cell.isFlagged) {
        cell.isFlagged = true;
        const numberOfFlags = this.state.numberOfFlags + 1;
        this.setState({playerBoard: board, numberOfFlags});
      } else {
        cell.isFlagged = false;
        const numberOfFlags = this.state.numberOfFlags - 1;
        this.setState({playerBoard: board, numberOfFlags});
      }
      return;
    }

    // Use Item
    if (this.state.itemActive) {
      const pattern = `pattern_${this.state.itemNumber}`;
      let numberOfFlags = this.state.numberOfFlags;

      const offsetCells = this.getOffsetCells(row, column, ItemPatterns[pattern].offsets);

      offsetCells.forEach(offsetCell => {
        const cell = board[offsetCell[0]][offsetCell[1]];
        if (cell.isBomb && !cell.isFlagged) {
          cell.isFlagged = true;
          numberOfFlags++;
        }
        else if (!cell.isBomb) {
          cell.isRevealed = true;
        }
      });

      this.spendMoney(ItemPatterns[pattern].cost);
      this.increaseRevealedCellsCount();
      this.setState({playerBoard: board, numberOfFlags, itemActive: false});

      return;
    }

    // Flagged or Revealed cell is clicked
    if (cell.isFlagged || cell.isRevealed) {
      return;
    }

    // First click of the game
    if (!this.state.bombsAdded) {
      cell.isStart = true;
      cell.isRevealed = true;
      cell.isResolved = true;
      const adjacentCells = this.getOffsetCells(cell.row, cell.column, AdjacentCells);

      adjacentCells.forEach(offsetCell => {
        board[offsetCell[0]][offsetCell[1]].isStart = true;
        this.increaseRevealedCellsCount();
        this.setState({playerBoard: board});
      });

      this.addBombs();
      this.addGems();
    }

    // Click
    else {
      // If cell IS a bomb
      if (cell.isBomb) {
        console.log('Bomb!');
        return;
      }

      // If cell is NOT a bomb
      else {
        cell.isRevealed = true;
      }

      this.setState({playerBoard: board});
    }

    // If adjacentBombs === 0
    if (cell.adjacentBombs === 0) {
      let unresolvedCells = this.state.unresolvedCells.push([cell.row, cell.column]);
      this.setState({unresolvedCells});
      this.resolveCells();
    }

    this.increaseRevealedCellsCount();
  }

  // Cell Out
  cellOut(e, row, column) {
    if (this.state.itemActive) {
      const board = this.state.playerBoard;
      const adjacentCells = this.getOffsetCells(row, column, AdjacentCells);
      adjacentCells.forEach(offsetCell => {
        const row = offsetCell[0];
        const column = offsetCell[1];

        board[row][column].isHovered = false;
        this.setState({playerBoard: board});
      });
    }
  }

  // Cell Hover
  cellHover(e, row, column) {
    if (this.state.itemActive) {
      var hoverXOffset = column * 40;
      var hoverYOffset = row * 40;

      this.setState({hoverXOffset, hoverYOffset});
    }
  }

  // Gem Click
  gemClick(row, column) {
    const playerBoard = this.state.playerBoard;
    let numberOfDiscoveredGems = this.state.numberOfDiscoveredGems + 1;
    let playerMoney = this.state.playerMoney + this.state.gemValue;

    playerBoard[row][column].isGem = false;
 
    this.setState({playerBoard, numberOfDiscoveredGems, playerMoney});
  }
 
  // Spend Money
  spendMoney(cost) {
    let spentMoney = this.state.spentMoney + cost;
    this.setState({spentMoney});
  }

  // Resolve cells with 0 adjacent bombs
  resolveCells() {
    while (this.state.unresolvedCells.length > 0) {
      const cell = this.state.unresolvedCells[0];
      const board = this.state.playerBoard;
      const adjacentCells = this.getOffsetCells(cell[0], cell[1], AdjacentCells);

      adjacentCells.forEach(offsetCell => {
        const row = offsetCell[0];
        const column = offsetCell[1];

        board[row][column].isRevealed = true;
        this.setState({playerBoard: board});

        if (board[row][column].adjacentBombs === 0 && board[row][column].isResolved === false) {
          board[row][column].isResolved = true;
          let unresolvedCells = this.state.unresolvedCells;
          unresolvedCells.push([row, column]);
          this.setState({unresolvedCells});
        }
      });

      let cells = this.state.unresolvedCells.shift();
      this.setState({unresolvedCells: cells});
    }
  }

  itemActivated(itemNumber) {
    if (this.state.itemActive) {
      this.setState({itemActive: false, itemNumber});
    } else {
      this.setState({itemActive: true, itemNumber});
    }
  }

  render() {
    const playerMoney = (this.state.numberOfRevealedCells * this.state.cellValue) + (this.state.numberOfDiscoveredGems * this.state.gemValue) - this.state.spentMoney;
    const imagePath = process.env.REACT_APP_IMAGE_PATH;
    return (
      <div className="desert-sweeper">
        <div>
          <div className="menu">
            <p onClick={this.generateBoard}>New Game</p>
            <p>Bombs Remaining: {this.state.numberOfBombs - this.state.numberOfFlags}</p>
            <p>Revealed Cells: {this.state.numberOfRevealedCells}</p>
            <div className="gems">
              <img src={`${imagePath}/gem.gif`} />
              <p> {this.state.numberOfDiscoveredGems}/{this.state.numberOfGems}</p>
            </div>
            <p>Money: {playerMoney}</p>
          </div>

          <div className="game-area">
            <div className={`hover-patterns pattern-${this.state.itemNumber}`} style={{display: this.state.itemActive ? 'block' : 'none', left: this.state.hoverXOffset, top: this.state.hoverYOffset}}></div>

            <PlayerBoard playerBoard={this.state.playerBoard} cellClick={this.cellClick} cellHover={this.cellHover} cellOut={this.cellOut} gemClick={this.gemClick} />
          </div>
          <Shop playerMoney={playerMoney} itemActivated={this.itemActivated} />
        </div>
      </div>
    );
  }
}

export default App;
