// Board handling

const pieces = Object.freeze({
  NONE: 0,
  WHITE: 1,
  BLACK: 2,
  WHITEQN: 3,
  BLACKQN: 4
});

export function makeBoard() {
  let board = []

  for (let i = 0; i < 8; ++i) {
    board.push([]);

    for (let j = 0; j < 8; ++j) {
      const playable = (i + j) % 2 === 1;

      if (!playable) {
        board[i].push(pieces.NONE);
      } else if (i < 3) {
        board[i].push(pieces.BLACK);
      } else if (i > 4) {
        board[i].push(pieces.WHITE);
      } else {
        board[i].push(pieces.NONE);
      }
    }
  }

  return board;
}

// Move handling

function applyMove(playerPieces, board, move) {
  const origin = move[0];
  const destination = move[1];

  if (
    origin.some(v => v < 0 || v > 7) ||
    destination.some(v => v < 0 || v > 7)
  ) {
    return false;
  }

  const originX = origin[0];
  const originY = origin[1];
  const destX = destination[0];
  const destY = destination[1];

  if ((originX + originY) % 2 !== 1) {
    return;
  } else if ((destX + destY) % 2 !== 1) {
    return;
  }

  const originPiece = board[originX][originY];

  // player not moving a piece or queen of their color
  if (originPiece !== playerPieces && originPiece !== playerPieces + 2) {
    return false;
  }

  const destPiece = board[destX][destY];

  // we can't move to where pieces are, only past them
  if (destPiece !== pieces.NONE) {
    return false;
  }

  if (originPiece == playerPieces) {
  }
}

export function handleMove(games, gameId, clients, playerId, msg) {
  if (!gameId) {
    return
  }

  const game = games.get(gameId);

  if (game.turn !== playerId) {
    return;
  }

  console.log("Movimento ainda não implementado.");
  /*
  applyMove(game.board, msg.move);

  const opponent = (game.white === userId) ? game.black : game.white;

  game.turn = opponent;

  clients.get(opponent)?.send(
    JSON.stringify(
      {
        type: "MOVE",
        move: msg.move,
      }
    )
  )
  */
}
