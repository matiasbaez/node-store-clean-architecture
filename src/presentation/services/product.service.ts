import { ProductModel } from "../../data";
import { CustomError, CreateProductDto, ProductEntity, PaginationDto } from "../../domain";

export class ProductService {

    constructor() {}

    public async get(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;

        try {

            const [ total, products ] = await Promise.all([

                ProductModel.countDocuments(),

                ProductModel.find({})
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate("user")

            ]);

            return {
                page,
                limit,
                total,
                next: `/api/products/page=${page + 1}&limit=${limit}`,
                previous: (page - 1 > 0) ? `/api/products/page=${page - 1}&limit=${limit}` : null,
                products
            };

        } catch(error) {
            throw CustomError.internalServer();
        }

    }

    public async post(createProductDto: CreateProductDto) {

        const existProduct = await ProductModel.findOne({ name: createProductDto.name });
        if (existProduct) throw CustomError.badRequest("Product already exists");

        try {

            const category = new ProductModel(createProductDto);

            await category.save();

            return ProductEntity.fromObject(category);

        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    public async update(id: string, createProductDto: CreateProductDto) {

        const existProduct = await ProductModel.findOne({ _id: id });
        if (!existProduct) throw CustomError.notFound("Product not found");

        try {

            const category = ProductModel.updateOne(
                { _id: id },
                {
                    ...existProduct,
                    ...createProductDto
                }
            );

            return ProductEntity.fromObject(category);

        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    public async remove(id: string) {

        const existProduct = await ProductModel.findOne({ _id: id });
        if (!existProduct) throw CustomError.notFound("Product not found");

        try {

            ProductModel.deleteOne({ _id: id });
            return true;


        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

}
