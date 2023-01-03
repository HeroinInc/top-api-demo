import {IsString, IsEmail} from 'class-validator'

export class AuthDto {
	@IsString()
	@IsEmail()
	login: string
	@IsString()
	password: string
}