import { IsNumber,IsString } from "class-validator"; 

export class CreateStripeDto {
    @IsNumber({},{message:''})
    price:number;
    @IsString({message:''})
    description:string;
    @IsString({message:''})
    user_id:string;
    @IsString({message:''})
    urlSuccess:string;
    @IsString({message:''})
    urlCancel:string;
    @IsString({message:''})
    email:string;
}
