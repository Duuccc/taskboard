import type { Request, Response, NextFunction } from 'express';
import  * as boardService from "../services/board.service.js";

export const createBoard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const board = await boardService.createBoard(req.body.title, req.userId);
        res.status(201).json(board);
    } catch (error) {
        next(error);
    }
}

export const getBoards = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const boards = await boardService.getBoards(req.userId);
        res.json(boards);
    } catch (error) {
        next(error);
    }
}