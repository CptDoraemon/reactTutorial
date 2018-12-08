import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}/>;
    };

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            winner: null,
            gameMode: 'ai'
        };
    }

    handleClick(i) {
        if (this.state.gameMode === 'human') {
            const history = this.state.history;
            const current = history[history.length - 1];
            const squares = [...current.squares];
            if (this.state.winner || squares[i]) return;
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{squares: squares}]),
                xIsNext: !this.state.xIsNext,
                winner: calculateWinner(squares),
            });
        } else {
            const history = this.state.history;
            const current = history[history.length - 1];
            const squares = [...current.squares];
            if (this.state.winner || squares[i]) return;
            squares[i] = 'X';

            if (calculateWinner(squares)) {
                this.setState({
                    history: history.concat([{squares: squares}]),
                    winner: calculateWinner(squares),
                });
            } else {
                const aiPossibleSteps = [];
                squares.map((i, index) => !i ? aiPossibleSteps.push(index) : null);
                const aiNextStep = aiPossibleSteps[Math.floor(Math.random() * aiPossibleSteps.length)];
                squares[aiNextStep] = 'O'

                this.setState({
                    history: history.concat([{squares: squares}]),
                    winner: calculateWinner(squares),
                });
            }
        }
    }

    jumpTo(historyIndex) {
        this.setState({
            history: this.state.history.slice(0, historyIndex + 1),
            xIsNext: historyIndex % 2 === 0 ? false : true,
            winner: null,
        })
    }
    toggleGameMode() {
        const newGameMode = this.state.gameMode === 'ai' ? 'human' : 'ai';
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            gameMode: newGameMode,
            winner: null,
            xIsNext: true
       });

    };

    render() {
        const history = this.state.history;
        const current = history[history.length - 1].squares;

        const moves = history.map((i, historyIndex) => {
            const desc = historyIndex ?
                'Go to move #' + historyIndex :
                'Go to game start';
            return (
                <li key={historyIndex}>
                    <button onClick={() => this.jumpTo(historyIndex)}> {desc} </button>
                </li>
            );
        });


        let status;
        if (this.state.gameMode === 'ai' && this.state.winner) {
            status = 'You win!';
        } else if (this.state.gameMode === 'ai' && !this.state.winner && current.indexOf(null) !== -1) {
            status ='';
        } else if (this.state.winner) {
            status = 'Winner: ' + this.state.winner;
        } else if (!this.state.winner && current.indexOf(null) === -1) {
            status = 'It\'s a draw game :D'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={this.state.history[this.state.history.length - 1].squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <button
                        className={this.state.gameMode === 'human' ? 'game-mode button-active' : 'game-mode'}
                        onClick={() => this.toggleGameMode()}>
                            Two Players</button>
                    <button
                        className={this.state.gameMode === 'ai' ? 'game-mode button-active' : 'game-mode'}
                        onClick={() => this.toggleGameMode()}>
                            Play with AI</button>
                    <div className='game-info-announcement' style={this.state.winner ? {color: 'red'} : null}>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i=0; i<lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) return squares[a];
    } return null;
}