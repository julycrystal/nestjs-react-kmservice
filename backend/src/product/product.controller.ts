import { Controller, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { Role } from "src/auth/role.decorator";
import { ProductService } from "./product.service";
import { diskStorage } from 'multer';
import { imageFileFilter } from "src/common/upload-utils";
import { CoreOutput } from "src/common/dtos/core.output";

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) { }

    @Role(['Admin'])
    @Post('upload/:productId')
    @UseInterceptors(
        FilesInterceptor('images', 20, {
            storage: diskStorage({
                destination: '../uploads/products',
                filename: (req, file, callback) => {
                    const name = file.originalname.split('.')[0];
                    const fileExtName = extname(file.originalname);
                    const randomName = Array(4)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    callback(null, `product-${name}-${randomName}${fileExtName}`);
                },
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async upload (
        @Param('productId') productId,
        @UploadedFiles() files,
    ): Promise<CoreOutput> {
        const filenames = files.map(file => file.filename);
        return this.productService.uploadProductPhotos(filenames, productId)
    }

}
