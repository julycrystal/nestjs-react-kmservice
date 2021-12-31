import { Controller, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { extname, join } from "path";
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
    @Post('uploadCoverImage/:productId')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: join(__dirname, '..', '..', 'uploads', 'products'),
                filename: (req, file, callback) => {
                    const name = file.originalname.toLowerCase().replace(' ', '-').split('.')[0]
                    const fileExtName = extname(file.originalname);
                    const randomName = Date.now().toString();
                    callback(null, `${name}-${randomName}${fileExtName}`);
                },
            }),
        }),
    )
    async uploadCoverImage (
        @Param('productId') productId: number,
        @UploadedFile() file,
    ): Promise<CoreOutput> {
        return this.productService.uploadProductCoverImage(productId, file?.filename)
    }
}
