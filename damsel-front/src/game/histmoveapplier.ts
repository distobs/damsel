import { applyMove } from "./moveapplier";

export function histMoveApplier(board: number[][], moves: any) {
  let newboard = board;

  for (let move of moves) {
    applyMove(newboard, move[0], move[1]);    
  }
  
  return newboard;
}