// src/profile/profile.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Profile } from "../schemas/profile.schema";
import { getWesternHorroscope, getChineseZodiac } from "../utils/computeAstrology.js";
import { calculateAge } from "../utils/computeAge";
import { horoscopeData } from "../utils/horoscopeData";
import { zodiacData } from "../utils/zodiacData";
// import  horoscopeData from "../utils/horoscopeData";
// import zodiacData  from "../utils/zodiacData";
import { normalizeWesternZodiac, normalizeChineseZodiac } from "../utils/cleanHoroscopeData";

const cleanHoroscopeData = normalizeWesternZodiac(horoscopeData);
const cleanZodiacData = normalizeChineseZodiac(zodiacData);

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

async updateProfile(userId: string, updateData: Partial<Profile>): Promise<Profile> {
  if (updateData.birthday) {
    const birthday = new Date(updateData.birthday);

    console.log("horoscopeData:", horoscopeData); // <-- add this line
    console.log("zodiacData", zodiacData);
    

    const horoscope = getWesternHorroscope(birthday, cleanHoroscopeData);
    const zodiac = getChineseZodiac(birthday, cleanZodiacData);
    const age = calculateAge(birthday);

    if (!updateData.horoscope) updateData.horoscope = horoscope ?? "";
    if (!updateData.zodiac) updateData.zodiac = zodiac ?? "";
    if (!updateData.age) updateData.age = age;
  }

  const profile = await this.profileModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: updateData },
    { new: true },
  );

  if (!profile) throw new NotFoundException("Profile not found");
  return profile;
}



  // async deleteProfile(userId: string): Promise<Profile | null> {
  //   return this.profileModel.findOneAndDelete({ userId: new Types.ObjectId(userId) });
  // }
}

// // src/profile/profile.service.ts
// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model, Types } from "mongoose";
// import { Profile } from '../schemas/profile.schema';
// import { getWesternHorroscope, getChineseZodiac } from '../utils/computeAstrology.js';
// import { calculateAge } from '../utils/computeAge';
// import horoscopeData from '../utils/horoscopeData';
// import zodiacData from '../utils/zodiacData';    

// @Injectable()
// export class ProfileService {
//   constructor(
//     @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
//   ) {}

//   async getProfileByUserId(userId: string) {
//     const profile = await this.profileModel.findOne({ userId: new Types.ObjectId(userId) });
//     if (!profile) throw new NotFoundException("Profile not found");
//     return profile;
//   }

//   // async updateProfile(userId: string, updateData: Partial<Profile>) {
//   //   const profile = await this.profileModel.findOneAndUpdate(
//   //     { userId: new Types.ObjectId(userId) },
//   //     { $set: updateData },
//   //     { new: true }
//   //   );
//   //   if (!profile) throw new NotFoundException("Profile not found");
//   //   return profile;
//   // }

//   async updateProfile(userId: string, updateData: Partial<Profile>) {
//     // Compute derived fields if birthday is present
//     if (updateData.birthday) {
//       const birthday = new Date(updateData.birthday);
//       updateData.horoscope = getWesternHorroscope(birthday, horoscopeData);
//       updateData.zodiac = getChineseZodiac(birthday, zodiacData);
//       updateData.age = calculateAge(birthday);
//     }

//     const profile = await this.profileModel.findOneAndUpdate(
//       { userId: new Types.ObjectId(userId) },
//       { $set: updateData },
//       { new: true }
//     );

//     if (!profile) throw new NotFoundException("Profile not found");

//     return profile;
//   }


// //   async deleteProfile(userId: string) {
// //     return this.profileModel.findOneAndDelete({ userId: new Types.ObjectId(userId) });
// //   }
// }
