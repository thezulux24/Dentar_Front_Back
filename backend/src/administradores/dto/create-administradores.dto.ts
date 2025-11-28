import { IsEmail, IsString, IsDateString, MinLength, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAdministradoresDto {
    @IsEmail()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    email: string;

    @MinLength(6)
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    clave: string;
}
