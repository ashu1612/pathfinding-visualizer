import React, { useEffect, useState } from 'react';
import './PathFind.css';
import Node from '../Node/Node';
import dfs from '../../Algorithms/Dfs';

const rows = 15;
const cols = 35;
const start_row = 0,
  start_col = 0,
  end_row = 7,
  end_col = 24;

const PathFind = () => {
  //Main grid that holds object structure
  const [grid, setGrid] = useState([]);

  // All the visited Node in order of their function call
  const [visitedNodes, setVisitedNodes] = useState([]);

  // shortest path according to the algorithm
  const [path, setPath] = useState([]);

  // Is it possible to traverse to the end node ?
  const [pathFound, setPathFound] = useState(false);

  // Walls
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  // Algo select dropdown
  const [algoSelect, setAlgoSelect] = useState('DFS');

  let tempGrid = [];

  const isValid = (i, j) => {
    return i >= 0 && i < rows && j >= 0 && j < cols;
  };

  const populateNeighbours = (i, j, grid) => {
    const x = [-1, 0, 1, 0];
    const y = [0, 1, 0, -1];
    let neh = [];
    for (let k = 0; k < 4; k++) {
      let nr = i + x[k],
        nc = j + y[k];
      if (isValid(nr, nc)) {
        neh.push(grid[nr][nc]);
      }
    }
    return neh;
  };

  //Run this before component render to init grid
  const initGrid = () => {
    console.log('yes');
    for (let i = 0; i < rows; i++) {
      let currNodes = [];
      for (let j = 0; j < cols; j++) {
        currNodes[j] = {
          isStart: i === start_row && j === start_col,
          isEnd: i === end_row && j === end_col,
          isVis: false,
          row: i,
          col: j,
          //   id: i + ' ' + j,
          weight: 1,
          wall: false,
          neighbours: [],
        };
      }
      tempGrid.push(currNodes);
    }

    // Add neightbours of the current nodes so we dont have to perform this calculation
    // while writing the algorithms
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        tempGrid[i][j].neighbours = populateNeighbours(i, j, tempGrid);
      }
    }
    setGrid(tempGrid);
  };

  const visualizeShortestPath = (path) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        document.getElementById(
          `cell-${path[i].row}-${path[i].col}`
        ).className = 'node node-shortest-path';
      }, 10 * i);
    }
  };

  const handleVisualizeAlgo = () => {
    console.log(grid[3][3].wall);
    let { visitedInOrder, pathFound, path } = dfs(grid[start_row][start_col]);
    console.log(visitedInOrder);
    for (let i = 0; i <= visitedInOrder.length; i++) {
      if (i === visitedInOrder.length) {
        setTimeout(() => {
          visualizeShortestPath(path);
        }, 20 * i);
      } else {
        setTimeout(() => {
          document.getElementById(
            `cell-${visitedInOrder[i].row}-${visitedInOrder[i].col}`
          ).className = 'node node-visited';
        }, 20 * i);
      }
    }
  };

  const handleReset = () => {
    let tempGrid2 = grid;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i === start_row && j === start_col) {
          // console.log(`cell-${grid[i][j].row}-${grid[i][j].col}`);
          document.getElementById(
            `cell-${grid[i][j].row}-${grid[i][j].col}`
          ).className = 'node node-start';
        } else if (i === end_row && j === end_col) {
          document.getElementById(
            `cell-${grid[i][j].row}-${grid[i][j].col}`
          ).className = 'node node-end';
        } else {
          document.getElementById(
            `cell-${grid[i][j].row}-${grid[i][j].col}`
          ).className = 'node';
        }
        tempGrid2[i][j].wall = false;
        tempGrid2[i][j].isVis = false;
      }
    }
    setPath([]);
    setPathFound(false);
    setVisitedNodes([]);
    setGrid(tempGrid2);
  };

  // run on mouseup
  const runAlgo = () => {
    console.log(grid);
    let path = dfs(grid[start_row][start_col]);
    setPath(path.path);
    setVisitedNodes(path.visitedInOrder);
    setPathFound(path.found);
  };

  const onMouseDown = (row, col) => {
    tempGrid = grid;
    tempGrid[row][col].wall = !tempGrid[row][col].wall;
    if (tempGrid[row][col].wall) {
      document.getElementById(
        `cell-${grid[row][col].row}-${grid[row][col].col}`
      ).className = 'node node-wall';
    } else {
      document.getElementById(
        `cell-${grid[row][col].row}-${grid[row][col].col}`
      ).className = 'node';
    }
    setGrid(tempGrid);
    setMouseIsPressed(true);
  };
  const onMouseUp = (row, col) => {
    setMouseIsPressed(false);
  };
  const onMouseEnter = (row, col) => {
    if (mouseIsPressed) {
      tempGrid = grid;
      tempGrid[row][col].wall = !tempGrid[row][col].wall;
      if (tempGrid[row][col].wall) {
        document.getElementById(
          `cell-${grid[row][col].row}-${grid[row][col].col}`
        ).className = 'node node-wall';
      } else {
        document.getElementById(
          `cell-${grid[row][col].row}-${grid[row][col].col}`
        ).className = 'node';
      }
      setGrid(tempGrid);
    }
  };

  const handleAlgoChange = (event) => {
    let algo = event.target.value;
    setAlgoSelect(algo);
  };

  useEffect(() => {
    initGrid();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='container'>
      <div>
        {grid.map((innerArray, index) => (
          <div key={index} className='grid'>
            {innerArray.map((item, i2) => {
              const { isStart, isEnd, row, col } = item;
              return (
                <Node
                  key={i2}
                  isStart={isStart}
                  isEnd={isEnd}
                  row={row}
                  col={col}
                  passonMouseDown={onMouseDown}
                  passonMouseUp={onMouseUp}
                  passonMouseEnter={onMouseEnter}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleVisualizeAlgo}>Visualize DFS</button>
      <button onClick={handleReset}> Reset Grid</button>
      <select onChange={handleAlgoChange}>
        <option value='none'></option>
        <option value='DFS'>DFS</option>
      </select>
    </div>
  );
};

export default PathFind;
