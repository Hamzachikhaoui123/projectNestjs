import { USERROLE } from "src/Enum/index";

export class CreateUserDto {
    name:string;
    photo:string;
    email:string;
    password: string; // Assurez-vous que cette propriété existe
    role:USERROLE

}
