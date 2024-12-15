import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseFilters, HttpException, HttpStatus, Res, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt'
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/Exception';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
@UseFilters(HttpExceptionFilter)

@Controller('user')
export class UsersController {
  constructor(private jwtService:JwtService,private readonly userService: UsersService) {}
  @UseInterceptors(
    FileInterceptor('photo',{
      storage:diskStorage({
        destination:"./uploads",
        filename:(req,file,callback)=>{
          const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9);
          const ext=extname(file.originalname);
          callback(null,`${file.fieldname}-${req.body.name}${ext}`);
        }
      })
    })
  )
  @Post()

async create(
  @Body() createUserDto: CreateUserDto,
  @UploadedFile() file: Express.Multer.File,
) {
  try {
    // Vérification des données
    console.log('Received Data:', createUserDto);

    // Validation de la propriété password
    if (!createUserDto.password) {
      throw new Error('Password is required.');
    }

    // Hachage du mot de passe
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);

    // Gestion du chemin de la photo
    const photoPath = file ? file.path : null;

    // Création de l'utilisateur
    return await this.userService.create(createUserDto, photoPath);
  } catch (error) {
    console.error('Error creating user:', error);
    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}



  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('login')
  @Post('login')
    async login(@Body() createUserdto:CreateUserDto,
    
    @Res({passthrough:true})reponse:Response
    ){
        
        const user=await this.userService.findByEmail(createUserdto.email);
        
        if(!user){

            throw new BadRequestException('user is not found')
            
        }
        if(!await bcrypt.compare(createUserdto.password as string,user.password)){
            
            throw new BadRequestException('Invalid redentilas')
        }
        
        const jwt= await this.jwtService.signAsync({id:user.id})
        
        reponse.cookie('jwt',jwt,{httpOnly:true})
      
        return {
            message:'success',
            user:user,
            access_token:jwt
        };
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
