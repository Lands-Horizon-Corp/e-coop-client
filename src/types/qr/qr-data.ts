export interface IQRUser {
    user_id: string
    email: string
    contact_number: string
    user_name: string
    name: string
    lastname: string
    firstname: string
    middlename: string
}

export interface IQRInvitationCode {
    organization_id: string
    branch_id: string
    UserType: string
    Code: string
    CurrentUse: number
    Description: string
}

export interface IQRMemberProfile {
    firstname: string
    lastname: string
    middlename: string
    contact_number: string
    member_profile_id: string
    branch_id: string
    organization_id: string
    email: string
}
