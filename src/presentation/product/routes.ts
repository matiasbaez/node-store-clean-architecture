import { Router } from 'express';
import { ProductController } from './controller';
import { ProductService } from '../services';
import { AuthMiddleware } from '../middlewares';

export class ProductRoutes {

  static get routes(): Router {

    const router = Router();
    const categoryService = new ProductService();
    const controller = new ProductController(categoryService);

    router.get("/", controller.get);
    router.post("/", [AuthMiddleware.validateJWT], controller.post);
    router.put("/:id", [AuthMiddleware.validateJWT], controller.update);
    router.delete("/:id", [AuthMiddleware.validateJWT], controller.remove);

    return router;
  }


}