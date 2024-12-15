import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository:Repository<User>){}
async  create(createUserDto: CreateUserDto,profilePhoto: string):Promise<User> {
    const  user= await this.userRepository.create({...createUserDto,createAt:new Date(),photo:profilePhoto})
    
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    try {
      // Vous pouvez spécifier un ordre si vous le souhaitez, par exemple par date de création
      return await this.userRepository.find();
    }  catch (error) {
      throw new InternalServerErrorException('Impossible de récupérer les utilisateurs');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

 async remove(id: string |any):Promise<void> {
  console.log("id",id);
  
  const user = await this.userRepository.findOne({ where: { id: id } });
    if(!user){
      throw new NotFoundException("user not found")
    }  
    if(user.photo){
      const pathPhoto=join(__dirname,'/src/',user.photo);
      try {
        unlinkSync(pathPhoto)
      } catch (error) {
        console.error(`Failed to delete photo ${error.message}`)
      }

    }
    await  this.userRepository.delete(id);
  }

 async findByEmail(email:any):Promise<User|undefined>{
  const user = await this.userRepository.findOneBy({email});

  return user;
 }
}
