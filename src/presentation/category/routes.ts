import { Router } from 'express';
import { CategoryController } from './controller';
import { CategoryService } from '../services';
import { AuthMiddleware } from '../middlewares';

export class CategoryRoutes {

  static get routes(): Router {

    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    router.get("/", controller.get);
    router.post("/", [AuthMiddleware.validateJWT], controller.post);
    router.put("/:id", [AuthMiddleware.validateJWT], controller.update);
    router.delete("/:id", [AuthMiddleware.validateJWT], controller.remove);

    return router;
  }


}