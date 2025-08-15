import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true})
export class Profile extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true})
    username: string;

    @Prop()
    age?: number;

    @Prop()
    gender?: string;

    @Prop({ type: [String] })
    interests?: string[];

    @Prop()
    backgroundImage?: string;

    @Prop()
    birthday?: Date;

    @Prop()
    horoscope?: string;

    @Prop()
    zodiac?: string;

    @Prop()
    height?: string;

    @Prop()
    weight?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);