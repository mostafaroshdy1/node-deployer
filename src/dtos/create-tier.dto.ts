
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTierDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  cpu: string; 

  @IsNotEmpty()
  @IsString()
  memory: string;  
}
