import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { UploadProfilePictureOutput } from './dto/upload-profile-picture.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
  ) { }

  @Role(['Admin', 'User'])
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'profile'),
        filename: (req, file, callback) => {
          const name = file.originalname.toLowerCase().replace(' ', '-').split('.')[0]
          const fileExtName = extname(file.originalname);
          const randomName = Date.now().toString();
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async upload (
    @AuthUser() user: User,
    @UploadedFile() file,
  ): Promise<UploadProfilePictureOutput> {
    return this.usersService.uploadProfilePicture(user, file?.filename)
  }

}
