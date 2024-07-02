import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
  @IsNotEmpty({message: "Name not empty"})
  name: string;

  @IsNotEmpty({message: "Address not empty"})
  address: string;

  @IsNotEmpty({message: "Description not empty"})
  description: string;

  @IsNotEmpty({message: "logo not empty"})
  logo: string;
}

