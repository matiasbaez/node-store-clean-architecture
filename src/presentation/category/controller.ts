import { Request, Response } from "express";
import { CustomError, CreateCategoryDto, PaginationDto } from "../../domain";
import { CategoryService } from "../services";

export class CategoryController {

    constructor(
        public readonly categoryService: CategoryService
    ) {}

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).send({ error: "Internal server error" });
    }

    get = (req: Request, res: Response) => {
        const { page = 1, limit = 20 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if (error) {
            return res.status(400).json(error);
        }

        this.categoryService.get(paginationDto!)
            .then((products) => res.json(products))
            .catch((error) => this.handleError(error, res));
    }

    post = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

        if (error) {
            return res.status(400).json(error);
        }

        this.categoryService.post(createCategoryDto!, req.body.user)
            .then((product) => res.status(201).json(product))
            .catch((error) => this.handleError(error, res));
    }

    update = (req: Request, res: Response) => {

        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

        if (error) {
            return res.status(400).json(error);
        }

        const { id } = req.params;
        this.categoryService.update(id, createCategoryDto!, req.body.user)
            .then((product) => res.json(product))
            .catch((error) => this.handleError(error, res));
    }

    remove = (req: Request, res: Response) => {

        const { token } = req.params;
        this.categoryService.remove(token)
            .then(() => res.json("Category removed"))
            .catch((error) => this.handleError(error, res));
    }

}