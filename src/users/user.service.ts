import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from "@/schemas/user.schema";
import { Profile } from "@/schemas/profile.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Profile.name) private profileModel: Model<Profile>
    ) {}
    
    async login(identifier: string, password: string) {
        const user = await this.userModel.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) throw new BadRequestException("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new BadRequestException("Invalid credentials");

        // Optionally return JWT here
        return { message: "Login successful", userId: user._id, username: user.username };
    }

    async register(
    email: string,
    username: string,
    password: string,
    profileData?: {
        age?: number;
        gender?: string;
        interests?: string[];
        backgroundImage?: string;
        birthday?: Date;
        horoscope?: string;
        zodiac?: string;
        height?: string;
        weight?: string;
    },
    ) {
    // Check if email or username already exists
    const existingUser = await this.userModel.findOne({
        $or: [{ email }, { username }],
    });
    if (existingUser) {
        throw new BadRequestException("Email or username already in use");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new this.userModel({
        email,
        username,
        password: hashedPassword,
    });
    await user.save(); // save first to get _id

    // Create profile
    await this.profileModel.create({
        userId: user._id,
        username,
        age: profileData?.age ?? null,
        gender: profileData?.gender ?? null,
        interests: profileData?.interests ?? [],
        backgroundImage: profileData?.backgroundImage ?? null,
        birthday: profileData?.birthday ?? null,
        horoscope: profileData?.horoscope ?? null,
        zodiac: profileData?.zodiac ?? null,
        height: profileData?.height ?? null,
        weight: profileData?.weight ?? null,
    });

    return user;
    }

    async findByEmailOrUsername(identifier: string): Promise<User> {
        const user = await this.userModel.findOne({
            $or: [{email: identifier}, {username: identifier}]
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }    
}