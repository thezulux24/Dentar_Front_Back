import { IsEmail, IsString, IsDateString, IsOptional, MinLength, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateOdontologoDto {
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

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    nombres: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    telefono: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    direccion: string;

    @IsDateString()
    @IsNotEmpty()
    @MaxLength(1000)
    fecha_de_nacimiento: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    especialidad: string;
}
