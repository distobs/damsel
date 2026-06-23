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

export function handleMove(game, white, clients, sel, tar) {
  // pra mó de não demorar, nois assume que essa proposição é verdade:
  // ∀Mx ∈ M, V(Mx)
  // onde M é o conjunto dos movimentos, e V é verdadeiro se seu argumento for um movimento validado
  // ou seja: ninguem vai verificar movimento nenhum

  const myPieces = (white) ? pieces.WHITE : pieces.BLACK;

  const possibleTargetsSemCume = [
    {tx: sel.sx + 1, ty: sel.sy + 1}, // sem cume
    {tx: sel.sx - 1, ty: sel.sy + 1},
    {tx: sel.sx + 1, ty: sel.sy - 1},
    {tx: sel.sx - 1, ty: sel.sy - 1},
  ];

  const possibleTargetsCumeno = [
    {tx: sel.sx + 2, ty: sel.sy + 2}, // cumeno
    {tx: sel.sx - 2, ty: sel.sy + 2},
    {tx: sel.sx + 2, ty: sel.sy - 2},
    {tx: sel.sx - 2, ty: sel.sy - 2},
  ];

  let idxTC = -1, idxTS = -1;

  possibleTargetsSemCume.some((v, idx) => {
    if (v.tx == tar.tx && v.ty == tar.ty) {
      idxTS = idx;
      return true;
    } else {
      return false;
    }
  });

  possibleTargetsCumeno.some((v, idx) => {
    if (v.tx == tar.tx && v.ty == tar.ty) {
      idxTC = idx;
      return true;
    } else {
      return false;
    }
  });

  game.board[sel.sy][sel.sx] = pieces.NONE;

  if (idxTS >= 0) {
    game.board[tar.ty][tar.tx] = myPieces;
  } else {
    switch (idxTC) {
      case 0:
        game.board[tar.ty - 1][tar.tx - 1] = pieces.NONE;
        game.board[tar.ty][tar.tx] = myPieces;
        break;
      case 1:        
        game.board[tar.ty - 1][tar.tx + 1] = pieces.NONE;
        game.board[tar.ty][tar.tx] = myPieces;
        break;
      case 2:
        game.board[tar.ty + 1][tar.tx - 1] = pieces.NONE;
        game.board[tar.ty][tar.tx] = myPieces;
        break;
      case 3:        
        game.board[tar.ty + 1][tar.tx + 1] = pieces.NONE;
        game.board[tar.ty][tar.tx] = myPieces;
        break;
    }
  }
  
  let gameover = true;

  const opponentPieces = (white) ? pieces.BLACK : pieces.WHITE;

  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      if (game.board[i][j] == opponentPieces) {
        gameover = false;
      }
    }
  }

  game.turn = (white) ? game.black : game.white;

  return gameover;
}