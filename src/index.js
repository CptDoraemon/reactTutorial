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
            gameMode: 'ai',
            humanWin: false,
            aiWin: false,
        };
    }

    handleClick(i) {
        if (this.state.gameMode === 'human') {
            // 2 players
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
            // play with AI
            const history = this.state.history;
            const current = history[history.length - 1];
            const squares = [...current.squares];
            if (this.state.aiWin || this.state.humanWin || squares[i]) return;
            squares[i] = 'X';

            //human win
            if (calculateWinner(squares)) {
                this.setState({
                    humanWin: true,
                    history: history.concat([{squares: squares}]),
                });
            } else {
                const aiPossibleSteps = [];
                squares.map((i, index) => !i ? aiPossibleSteps.push(index) : null);
                const aiNextStep = aiPossibleSteps[Math.floor(Math.random() * aiPossibleSteps.length)];
                squares[aiNextStep] = 'O';

                //AI win
                if (calculateWinner(squares)) {
                    this.setState({
                        aiWin: true,
                        history: history.concat([{squares: squares}]),
                    })
                } else {
                    this.setState({
                        history: history.concat([{squares: squares}]),
                    })
                }

            }
        }
    }

    jumpTo(historyIndex) {
        this.setState({
            history: this.state.history.slice(0, historyIndex + 1),
            xIsNext: historyIndex % 2 === 0 ? false : true,
            winner: null,
            aiWin: false,
            humanWin: false
        })
    }
    toggleGameMode() {
        const newGameMode = this.state.gameMode === 'ai' ? 'human' : 'ai';
        this.setState(
            {
                history: [{
                    squares: Array(9).fill(null),
                }],
                xIsNext: true,
                winner: null,
                gameMode: newGameMode,
                humanWin: false,
                aiWin: false,
            }
        );

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
        if (this.state.aiWin) {
            status = 'You Lost!';
        } else if (this.state.humanWin) {
            status = 'You Win!';
        } else if (this.state.gameMode === 'ai' && !this.state.aiWin && !this.state.aiWin && current.indexOf(null) !== -1) {
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
                            Play with Artificial Dumb Dumb</button>
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

