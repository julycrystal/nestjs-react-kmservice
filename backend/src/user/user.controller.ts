import { Controller, Post, Body, UseInterceptors, UploadedFile, Logger, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
        destination: '../uploads/profile',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async upload (
    @AuthUser() user: User,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadProfilePictureOutput> {
    return this.usersService.uploadProfilePicture(user, file.filename)
  }

}
