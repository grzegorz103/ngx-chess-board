import { King } from '../../models/pieces/king';
import { Pawn } from '../../models/pieces/pawn';
import { MoveUtils } from '../../utils/move-utils';
import { AbstractPgnProcessor } from './abstract-pgn-processor';
export class DefaultPgnProcessor extends AbstractPgnProcessor {
    process(board, sourcePiece, destPoint, destPiece) {
        this.currentIndex += 0.5;
        let currentMove = '';
        if (this.currentIndex % Math.floor(this.currentIndex) === 0) {
            currentMove = this.currentIndex + '. ';
        }
        let possibleCaptures = [];
        let possibleMoves = [];
        if (destPiece) {
            possibleCaptures = MoveUtils.findPieceByPossibleCapturesContaining(MoveUtils.formatSingle(destPoint, board.reverted), board, sourcePiece.color).filter(piece => piece.constructor.name === sourcePiece.constructor.name);
        }
        possibleMoves = MoveUtils.findPieceByPossibleMovesContaining(MoveUtils.formatSingle(destPoint, board.reverted), board, sourcePiece.color).filter(piece => piece.constructor.name === sourcePiece.constructor.name);
        if (sourcePiece instanceof Pawn && !destPiece && possibleCaptures.length === 0) {
            currentMove += MoveUtils.formatSingle(destPoint, board.reverted);
        }
        else {
            if (sourcePiece instanceof Pawn && destPiece) {
                currentMove += (MoveUtils.formatSingle(sourcePiece.point, board.reverted).substring(0, 1) + 'x' + MoveUtils.formatSingle(destPoint, board.reverted));
            }
            else {
                if (sourcePiece instanceof King && (Math.abs(sourcePiece.point.col - destPoint.col) === 2)) {
                    if (board.reverted) {
                        currentMove += (destPoint.col < 2
                            ? 'O-O'
                            : 'O-O-O');
                    }
                    else {
                        currentMove += destPoint.col < 3
                            ? 'O-O-O'
                            : 'O-O';
                    }
                }
                else {
                    if (!(sourcePiece instanceof Pawn) && possibleCaptures.length === 0 && possibleMoves.length < 2) { // Nf3
                        currentMove += MoveUtils.getFirstLetterPiece(sourcePiece) + MoveUtils.formatSingle(destPoint, board.reverted);
                    }
                    else {
                        if (possibleMoves && possibleMoves.length === 2 && possibleCaptures.length === 0) { // Nbd7
                            if (this.isEqualByCol(possibleMoves[0], possibleMoves[1])) {
                                currentMove += MoveUtils.getFirstLetterPiece(sourcePiece) + MoveUtils.reverse(board, sourcePiece.point.row) + MoveUtils.formatSingle(destPoint, board.reverted);
                            }
                            else {
                                currentMove += MoveUtils.getFirstLetterPiece(sourcePiece) + MoveUtils.formatCol(board, sourcePiece.point.col) + MoveUtils.formatSingle(destPoint, board.reverted);
                            }
                        }
                        else {
                            if (possibleCaptures.length > 1) {
                                if ((this.isEqualByCol(possibleCaptures[0], possibleCaptures[1]))) {
                                    currentMove += MoveUtils.getFirstLetterPiece(sourcePiece) + MoveUtils.reverse(board, sourcePiece.point.row) + 'x' + MoveUtils.formatSingle(destPoint, board.reverted);
                                }
                                else {
                                    currentMove += MoveUtils.getFirstLetterPiece(sourcePiece) + MoveUtils.formatCol(board, sourcePiece.point.col) + 'x' + MoveUtils.formatSingle(destPoint, board.reverted);
                                }
                            }
                            else {
                                currentMove += MoveUtils.getFirstLetterPiece(sourcePiece) + 'x' + MoveUtils.formatSingle(destPoint, board.reverted);
                            }
                        }
                    }
                }
            }
        }
        this.pgn.push(currentMove);
    }
    resolvePieceByFirstChar(move, piece) {
        return MoveUtils.getFirstLetterPiece(piece) === move;
    }
    isEqualByCol(aPiece, bPiece) {
        return aPiece.point.col === bPiece.point.col;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wZ24tcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWNoZXNzLWJvYXJkL3NyYy9saWIvZW5naW5lL3Bnbi9kZWZhdWx0LXBnbi1wcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUdoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEUsTUFBTSxPQUFPLG1CQUFvQixTQUFRLG9CQUFvQjtJQUVsRCxPQUFPLENBQ1YsS0FBWSxFQUNaLFdBQWtCLEVBQ2xCLFNBQWdCLEVBQ2hCLFNBQWlCO1FBRWpCLElBQUksQ0FBQyxZQUFZLElBQUksR0FBRyxDQUFDO1FBQ3pCLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hELFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUMxQztRQUNELElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUV2QixJQUFJLFNBQVMsRUFBRTtZQUNYLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FDOUQsU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUNqRCxLQUFLLEVBQ0wsV0FBVyxDQUFDLEtBQUssQ0FDcEIsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FB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LE9BQU8sU0FBUyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQztJQUN6RCxDQUFDO0lBRU8sWUFBWSxDQUFDLE1BQWEsRUFBRSxNQUFhO1FBQzdDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDakQsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuLi8uLi9tb2RlbHMvYm9hcmQnO1xuaW1wb3J0IHsgS2luZyB9IGZyb20gJy4uLy4uL21vZGVscy9waWVjZXMva2luZyc7XG5pbXBvcnQgeyBQYXduIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BpZWNlcy9wYXduJztcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BpZWNlcy9waWVjZSc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uLy4uL21vZGVscy9waWVjZXMvcG9pbnQnO1xuaW1wb3J0IHsgTW92ZVV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW92ZS11dGlscyc7XG5pbXBvcnQgeyBBYnN0cmFjdFBnblByb2Nlc3NvciB9IGZyb20gJy4vYWJzdHJhY3QtcGduLXByb2Nlc3Nvcic7XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0UGduUHJvY2Vzc29yIGV4dGVuZHMgQWJzdHJhY3RQZ25Qcm9jZXNzb3Ige1xuXG4gICAgcHVibGljIHByb2Nlc3MoXG4gICAgICAgIGJvYXJkOiBCb2FyZCxcbiAgICAgICAgc291cmNlUGllY2U6IFBpZWNlLFxuICAgICAgICBkZXN0UG9pbnQ6IFBvaW50LFxuICAgICAgICBkZXN0UGllY2U/OiBQaWVjZVxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCArPSAwLjU7XG4gICAgICAgIGxldCBjdXJyZW50TW92ZSA9ICcnO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRJbmRleCAlIE1hdGguZmxvb3IodGhpcy5jdXJyZW50SW5kZXgpID09PSAwKSB7XG4gICAgICAgICAgICBjdXJyZW50TW92ZSA9IHRoaXMuY3VycmVudEluZGV4ICsgJy4gJztcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zc2libGVDYXB0dXJlcyA9IFtdO1xuICAgICAgICBsZXQgcG9zc2libGVNb3ZlcyA9IFtdO1xuXG4gICAgICAgIGlmIChkZXN0UGllY2UpIHtcbiAgICAgICAgICAgIHBvc3NpYmxlQ2FwdHVyZXMgPSBNb3ZlVXRpbHMuZmluZFBpZWNlQnlQb3NzaWJsZUNhcHR1cmVzQ29udGFpbmluZyhcbiAgICAgICAgICAgICAgICBNb3ZlVXRpbHMuZm9ybWF0U2luZ2xlKGRlc3RQb2ludCwgYm9hcmQucmV2ZXJ0ZWQpLFxuICAgICAgICAgICAgICAgIGJvYXJkLFxuICAgICAgICAgICAgICAgIHNvdXJjZVBpZWNlLmNvbG9yXG4gICAgICAgICAgICApLmZpbHRlcihwaWVjZSA9PiBwaWVjZS5jb25zdHJ1Y3Rvci5uYW1lID09PSBzb3VyY2VQaWVjZS5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBwb3NzaWJsZU1vdmVzID0gTW92ZVV0aWxzLmZpbmRQaWVjZUJ5UG9zc2libGVNb3Zlc0NvbnRhaW5pbmcoXG4gICAgICAgICAgICBNb3ZlVXRpbHMuZm9ybWF0U2luZ2xlKGRlc3RQb2ludCwgYm9hcmQucmV2ZXJ0ZWQpLFxuICAgICAgICAgICAgYm9hcmQsXG4gICAgICAgICAgICBzb3VyY2VQaWVjZS5jb2xvclxuICAgICAgICApLmZpbHRlcihwaWVjZSA9PiBwaWVjZS5jb25zdHJ1Y3Rvci5uYW1lID09PSBzb3VyY2VQaWVjZS5jb25zdHJ1Y3Rvci5uYW1lKTtcblxuICAgICAgICBpZiAoc291cmNlUGllY2UgaW5zdGFuY2VvZiBQYXduICYmICFkZXN0UGllY2UgJiYgcG9zc2libGVDYXB0dXJlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGN1cnJlbnRNb3ZlICs9IE1vdmVVdGlscy5mb3JtYXRTaW5nbGUoZGVzdFBvaW50LCBib2FyZC5yZXZlcnRlZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc291cmNlUGllY2UgaW5zdGFuY2VvZiBQYXduICYmIGRlc3RQaWVjZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRNb3ZlICs9IChNb3ZlVXRpbHMuZm9ybWF0U2luZ2xlKFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VQaWVjZS5wb2ludCxcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQucmV2ZXJ0ZWRcbiAgICAgICAgICAgICAgICApLnN1YnN0cmluZygwLCAxKSArICd4JyArIE1vdmVVdGlscy5mb3JtYXRTaW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIGRlc3RQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQucmV2ZXJ0ZWRcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZVBpZWNlIGluc3RhbmNlb2YgS2luZyAmJiAoTWF0aC5hYnMoc291cmNlUGllY2UucG9pbnQuY29sIC0gZGVzdFBvaW50LmNvbCkgPT09IDIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChib2FyZC5yZXZlcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE1vdmUgKz0gKGRlc3RQb2ludC5jb2wgPCAyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnTy1PJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ08tTy1PJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TW92ZSArPSBkZXN0UG9pbnQuY29sIDwgM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ08tTy1PJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ08tTyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShzb3VyY2VQaWVjZSBpbnN0YW5jZW9mIFBhd24pICYmIHBvc3NpYmxlQ2FwdHVyZXMubGVuZ3RoID09PSAwICYmIHBvc3NpYmxlTW92ZXMubGVuZ3RoIDwgMikgeyAgICAgLy8gTmYzXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TW92ZSArPSBNb3ZlVXRpbHMuZ2V0Rmlyc3RMZXR0ZXJQaWVjZShzb3VyY2VQaWVjZSkgKyBNb3ZlVXRpbHMuZm9ybWF0U2luZ2xlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2FyZC5yZXZlcnRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZU1vdmVzICYmIHBvc3NpYmxlTW92ZXMubGVuZ3RoID09PSAyICYmIHBvc3NpYmxlQ2FwdHVyZXMubGVuZ3RoID09PSAwKSB7ICAgIC8vIE5iZDdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0VxdWFsQnlDb2woXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlTW92ZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlTW92ZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRNb3ZlICs9ICBNb3ZlVXRpbHMuZ2V0Rmlyc3RMZXR0ZXJQaWVjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVBpZWNlKSArIE1vdmVVdGlscy5yZXZlcnNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VQaWVjZS5wb2ludC5yb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSArIE1vdmVVdGlscy5mb3JtYXRTaW5nbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0UG9pbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2FyZC5yZXZlcnRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRNb3ZlICs9IE1vdmVVdGlscy5nZXRGaXJzdExldHRlclBpZWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlUGllY2UpICsgTW92ZVV0aWxzLmZvcm1hdENvbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlUGllY2UucG9pbnQuY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgKyBNb3ZlVXRpbHMuZm9ybWF0U2luZ2xlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdFBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmQucmV2ZXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUNhcHR1cmVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0aGlzLmlzRXF1YWxCeUNvbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlQ2FwdHVyZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZUNhcHR1cmVzWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TW92ZSArPSBNb3ZlVXRpbHMuZ2V0Rmlyc3RMZXR0ZXJQaWVjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VQaWVjZSkgKyBNb3ZlVXRpbHMucmV2ZXJzZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2FyZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VQaWVjZS5wb2ludC5yb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgKyAneCcgKyBNb3ZlVXRpbHMuZm9ybWF0U2luZ2xlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RQb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2FyZC5yZXZlcnRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRNb3ZlICs9IE1vdmVVdGlscy5nZXRGaXJzdExldHRlclBpZWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVBpZWNlKSArIE1vdmVVdGlscy5mb3JtYXRDb2woXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlUGllY2UucG9pbnQuY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICsgJ3gnICsgTW92ZVV0aWxzLmZvcm1hdFNpbmdsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0UG9pbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmQucmV2ZXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TW92ZSArPSBNb3ZlVXRpbHMuZ2V0Rmlyc3RMZXR0ZXJQaWVjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVBpZWNlKSArICd4JyArIE1vdmVVdGlscy5mb3JtYXRTaW5nbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0UG9pbnQsIGJvYXJkLnJldmVydGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGduLnB1c2goY3VycmVudE1vdmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzb2x2ZVBpZWNlQnlGaXJzdENoYXIobW92ZTogc3RyaW5nLCBwaWVjZTogUGllY2UpIHtcbiAgICAgICAgcmV0dXJuIE1vdmVVdGlscy5nZXRGaXJzdExldHRlclBpZWNlKHBpZWNlKSA9PT0gbW92ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRXF1YWxCeUNvbChhUGllY2U6IFBpZWNlLCBiUGllY2U6IFBpZWNlKSB7XG4gICAgICAgIHJldHVybiBhUGllY2UucG9pbnQuY29sID09PSBiUGllY2UucG9pbnQuY29sO1xuICAgIH1cblxufVxuIl19