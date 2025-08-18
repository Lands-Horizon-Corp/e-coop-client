import { z } from 'zod';
import { MediaResponseSchema } from './media';
import { entityIdSchema } from './common';

// Define the Zod schema for UserResponse
export const UserResponseSchema = z.object({
    id: entityIdSchema,
    media_id: entityIdSchema.optional(),
    media: MediaResponseSchema.optional(),
    signature_media_id: entityIdSchema.optional(),
    signature_media: MediaResponseSchema.optional(),
    birthdate: z.string().optional(),
    user_name: z.string(),
    description: z.string().optional(),
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    full_name: z.string().optional(),
    suffix: z.string().optional(),
    email: z.string().email(),
    is_email_verified: z.boolean(),
    contact_number: z.string(),
    is_contact_verified: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
    qr_code: z.any().optional(),
    footsteps: z.array(z.any()).optional(),
    generated_reports: z.array(z.any()).optional(),
    notifications: z.array(z.any()).optional(),
    user_organizations: z.array(z.any()).optional(),
});

// Define the Zod schema for CurrentUserResponse
export const CurrentUserResponseSchema = z.object({
    user_id: entityIdSchema,
    user: UserResponseSchema.optional(),
    user_organization: z.any().optional(),
    is_logged_in_on_other_device: z.boolean(),
    users: z.any().optional(),
});

// Define the Zod schema for UserLoginRequest
export const UserLoginRequestSchema = z.object({
    key: z.string().min(1),
    password: z.string().min(8),
});

// Define the Zod schema for UserRegisterRequest
export const UserRegisterRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    birthdate: z.string().optional(),
    user_name: z.string().min(3).max(100),
    full_name: z.string().optional(),
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    suffix: z.string().optional(),
    contact_number: z.string().min(7).max(20),
    media_id: entityIdSchema.optional(),
});

// Define the Zod schema for UserForgotPasswordRequest
export const UserForgotPasswordRequestSchema = z.object({
    key: z.string().min(1),
});

// Define the Zod schema for UserChangePasswordRequest
export const UserChangePasswordRequestSchema = z.object({
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
});

// Define the Zod schema for UserVerifyContactNumberRequest
export const UserVerifyContactNumberRequestSchema = z.object({
    otp: z.string().min(6),
});

// Define the Zod schema for UserVerifyEmailRequest
export const UserVerifyEmailRequestSchema = z.object({
    otp: z.string().min(6),
});

// Define the Zod schema for UserSettingsChangePasswordRequest
export const UserSettingsChangePasswordRequestSchema = z.object({
    old_password: z.string().min(8),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
});

// Define the Zod schema for UserSettingsChangeEmailRequest
export const UserSettingsChangeEmailRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

// Define the Zod schema for UserSettingsChangeUsernameRequest
export const UserSettingsChangeUsernameRequestSchema = z.object({
    user_name: z.string().min(3).max(100),
    password: z.string().min(8),
});

// Define the Zod schema for UserSettingsChangeContactNumberRequest
export const UserSettingsChangeContactNumberRequestSchema = z.object({
    contact_number: z.string().min(7).max(20),
    password: z.string().min(8),
});

// Define the Zod schema for UserSettingsChangeProfilePictureRequest
export const UserSettingsChangeProfilePictureRequestSchema = z.object({
    media_id: entityIdSchema,
});

// Define the Zod schema for UserSettingsChangeProfileRequest
export const UserSettingsChangeProfileRequestSchema = z.object({
    birthdate: z.string(),
    description: z.string().optional(),
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    full_name: z.string().optional(),
    suffix: z.string().optional(),
});

// Define the Zod schema for UserSettingsChangeGeneralRequest
export const UserSettingsChangeGeneralRequestSchema = z.object({
    contact_number: z.string().min(7).max(20),
    description: z.string().optional(),
    email: z.email(),
    user_name: z.string().min(3).max(100),
});

// Infer the TypeScript types from the Zod schemas
export type IUserResponse = z.infer<typeof UserResponseSchema>;
export type ICurrentUserResponse = z.infer<typeof CurrentUserResponseSchema>;
export type IUserLoginRequest = z.infer<typeof UserLoginRequestSchema>;
export type IUserRegisterRequest = z.infer<typeof UserRegisterRequestSchema>;
export type IUserForgotPasswordRequest = z.infer<
    typeof UserForgotPasswordRequestSchema
>;
export type IUserChangePasswordRequest = z.infer<
    typeof UserChangePasswordRequestSchema
>;
export type IUserVerifyContactNumberRequest = z.infer<
    typeof UserVerifyContactNumberRequestSchema
>;
export type IUserVerifyEmailRequest = z.infer<
    typeof UserVerifyEmailRequestSchema
>;
export type IUserSettingsChangePasswordRequest = z.infer<
    typeof UserSettingsChangePasswordRequestSchema
>;
export type IUserSettingsChangeEmailRequest = z.infer<
    typeof UserSettingsChangeEmailRequestSchema
>;
export type IUserSettingsChangeUsernameRequest = z.infer<
    typeof UserSettingsChangeUsernameRequestSchema
>;
export type IUserSettingsChangeContactNumberRequest = z.infer<
    typeof UserSettingsChangeContactNumberRequestSchema
>;
export type IUserSettingsChangeProfilePictureRequest = z.infer<
    typeof UserSettingsChangeProfilePictureRequestSchema
>;
export type IUserSettingsChangeProfileRequest = z.infer<
    typeof UserSettingsChangeProfileRequestSchema
>;
export type IUserSettingsChangeGeneralRequest = z.infer<
    typeof UserSettingsChangeGeneralRequestSchema
>;
