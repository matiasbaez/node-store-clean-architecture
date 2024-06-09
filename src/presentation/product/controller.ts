import { Request, Response } from "express";
import { CustomError, CreateProductDto, PaginationDto } from "../../domain";
import { ProductService } from "../services";

export class ProductController {

    constructor(
        public readonly productService: ProductService
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

        this.productService.get(paginationDto!)
            .then((products) => res.json(products))
            .catch((error) => this.handleError(error, res));
    }

    post = (req: Request, res: Response) => {
        const [error, createProductDto] = CreateProductDto.create(req.body);

        if (error) {
            return res.status(400).json(error);
        }

        this.productService.post(createProductDto!)
            .then((product) => res.json(product))
            .catch((error) => this.handleError(error, res));
    }

    update = (req: Request, res: Response) => {

        const [error, createProductDto] = CreateProductDto.create(req.body);

        if (error) {
            return res.status(400).json(error);
        }

        const { id } = req.params;
        this.productService.update(id, createProductDto!)
            .then((product) => res.json(product))
            .catch((error) => this.handleError(error, res));
    }

    remove = (req: Request, res: Response) => {

        const { token } = req.params;
        this.productService.remove(token)
            .then(() => res.json("Email validated"))
            .catch((error) => this.handleError(error, res));
    }

}