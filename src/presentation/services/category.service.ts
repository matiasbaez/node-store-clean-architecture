import { CategoryModel } from "../../data";
import { CustomError, CreateCategoryDto, CategoryEntity, UserEntity, PaginationDto } from "../../domain";

export class CategoryService {

    constructor() {}

    public async get(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;

        try {

            const [ total, categories ] = await Promise.all([

                CategoryModel.countDocuments(),

                CategoryModel.find({})
                    .skip((page - 1) * limit)
                    .limit(limit)

            ]);

            return {
                page,
                limit,
                total,
                next: `/api/categories/page=${page + 1}&limit=${limit}`,
                previous: (page - 1 > 0) ? `/api/categories/page=${page - 1}&limit=${limit}` : null,
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available,
                }))
            };

        } catch(error) {
            throw CustomError.internalServer();
        }

    }

    public async post(createCategoryDto: CreateCategoryDto, user: UserEntity) {

        const existCategory = await CategoryModel.findOne({ name: createCategoryDto.name });
        if (existCategory) throw CustomError.badRequest("Category already exists");

        try {

            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await category.save();

            return CategoryEntity.fromObject(category);

        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    public async update(id: string, createCategoryDto: CreateCategoryDto, user: UserEntity) {

        const existCategory = await CategoryModel.findOne({ _id: id });
        if (!existCategory) throw CustomError.notFound("Category not found");

        try {

            const category = CategoryModel.updateOne(
                { _id: id },
                {
                    ...existCategory,
                    ...createCategoryDto
                }
            );

            return CategoryEntity.fromObject(category);

        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    public async remove(id: string) {

        const existCategory = await CategoryModel.findOne({ _id: id });
        if (!existCategory) throw CustomError.notFound("Category not found");

        try {

            CategoryModel.deleteOne({ _id: id });
            return true;


        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

}
