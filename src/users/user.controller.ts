import { Body, Controller, Post, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { Profile } from "@/schemas/profile.schema";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() body: any) {
        const { email, username, password, ...profileData } = body;
        return this.userService.register(email, username, password, profileData);
    }

      @Post('login')
    async login(
        @Body('identifier') identifier: string,  // email or username
        @Body('password') password: string
    ) {
        return this.userService.login(identifier, password);
    }

    @Get('find')
    async findUser(@Query('identifier') identifier: string) {
        return this.userService.findByEmailOrUsername(identifier);
    }
}