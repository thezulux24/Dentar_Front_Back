import { IsEmail, IsString, IsDateString, MinLength, IsNotEmpty, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class UpdateAdministradoresDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @IsOptional()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @IsOptional()
    apellidos: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @IsOptional()
    email: string;

    // @IsNumber()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(15)
    @IsOptional()
    telefono: number;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsOptional()
    direccion: string;

    @IsDateString()
    @IsNotEmpty()
    @MaxLength(1000)
    @IsOptional()
    fecha_de_nacimiento: string;
}
