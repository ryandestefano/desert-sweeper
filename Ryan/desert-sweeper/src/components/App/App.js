import React, { Component } from 'react';
import './App.css';

import PlayerBoard from '../PlayerBoard/PlayerBoard';

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
      bombsAdded: false,
      unresolvedCells: []
    };
    this.generateBoard = this.generateBoard.bind(this);
    this.getAdjacentCells = this.getAdjacentCells.bind(this);
    this.addBombs = this.addBombs.bind(this);
    this.addGems = this.addGems.bind(this);
    this.countAdjacentBombs = this.countAdjacentBombs.bind(this);
    this.cellClick = this.cellClick.bind(this);
    this.resolveCells = this.resolveCells.bind(this);
    this.increaseRevealedCellsCount = this.increaseRevealedCellsCount.bind(this);
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
      unresolvedCells: []
    });
    return board;
  }

  // GET ADJACENT CELLS
  getAdjacentCells(row, column) {
    const offsets = [ [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1] ];
    let adjacentCells = [];

    offsets.forEach(offset => {
      const offsetRow = row + offset[0];
      const offsetColumn = column + offset[1];

      if (offsetRow >= 0 && offsetRow < this.state.numberOfRows && offsetColumn >= 0 && offsetColumn < this.state.numberOfColumns) {
        adjacentCells.push([offsetRow, offsetColumn]);
      }
    });

    return adjacentCells;
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
        const adjacentCells = this.getAdjacentCells(cell.row, cell.column);

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
    let numberOfDiscoveredGems = 0;

    board.forEach(row => {
      row.forEach(cell => {

        if (cell.isRevealed) {
          numberOfRevealedCells++;
          if (cell.isGem) {
            numberOfDiscoveredGems++;
          }
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

    this.setState({numberOfRevealedCells, numberOfDiscoveredGems});
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

    // Build Obelisk
    if (e.altKey && !cell.isRevealed) {
      const adjacentCells = this.getAdjacentCells(row, column);
      let numberOfFlags = this.state.numberOfFlags;

      adjacentCells.forEach(offsetCell => {
        const cell = board[offsetCell[0]][offsetCell[1]];
        cell.isObelisk = true;
        if (cell.isBomb && !cell.isFlagged) {
          cell.isFlagged = true;
          numberOfFlags++;
        }
        else if (!cell.isBomb) {
          cell.isRevealed = true;
        }
      });

      this.increaseRevealedCellsCount();
      this.setState({playerBoard: board, numberOfFlags});

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
      const adjacentCells = this.getAdjacentCells(cell.row, cell.column);

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

  // Resolve cells with 0 adjacent bombs
  resolveCells() {
    while (this.state.unresolvedCells.length > 0) {
      const cell = this.state.unresolvedCells[0];
      const board = this.state.playerBoard;
      const adjacentCells = this.getAdjacentCells(cell[0], cell[1]);

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

  render() {
    return (
      <div>
        <p onClick={this.generateBoard}>New Game</p>
        <p>Bombs Remaining: {this.state.numberOfBombs - this.state.numberOfFlags}</p>
        <p>Revealed Cells: {this.state.numberOfRevealedCells}</p>
        <p>Gems Discovered: {this.state.numberOfDiscoveredGems}</p>
        <PlayerBoard playerBoard={this.state.playerBoard} cellClick={this.cellClick} />
      </div>
    );
  }
}

export default App;
