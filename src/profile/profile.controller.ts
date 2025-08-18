import { Controller, Get, Patch, Delete, Param, Body } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { Profile } from "@/schemas/profile.schema";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // GET /profile/:userId
  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  // PATCH /profile/:userId
  @Patch(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateData: Partial<Profile>,
  ) {
    return this.profileService.updateProfile(userId, updateData);
  }

  // DELETE /profile/:userId
//   @Delete(':userId')
//   async deleteProfile(@Param('userId') userId: string) {
//     return this.profileService.deleteProfile(userId);
//   }
}
