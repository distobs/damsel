import { pieces } from "./board";

export function applyMove(board: number[][], sel: {sx: number, sy: number}, tar: {tx: number, ty: number}) {
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

  const myPieces = board[sel.sy][sel.sx];
  board[sel.sy][sel.sx] = pieces.NONE;

  if (idxTS >= 0) {
    board[tar.ty][tar.tx] = myPieces;
  } else {
    switch (idxTC) {
      case 0:
        board[tar.ty - 1][tar.tx - 1] = pieces.NONE;
        board[tar.ty][tar.tx] = myPieces;
        break;
      case 1:        
        board[tar.ty - 1][tar.tx + 1] = pieces.NONE;
        board[tar.ty][tar.tx] = myPieces;
        break;
      case 2:
        board[tar.ty + 1][tar.tx - 1] = pieces.NONE;
        board[tar.ty][tar.tx] = myPieces;
        break;
      case 3:        
        board[tar.ty + 1][tar.tx + 1] = pieces.NONE;
        board[tar.ty][tar.tx] = myPieces;
        break;
    }
  }
  
  return board;
}