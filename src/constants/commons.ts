export const PASSWORD_MIN_LENGTH = 8

export const HELP_CONTACT = '09123456789'

export const PICKERS_SELECT_PAGE_SIZE = 100 // Use for Selects or Pickers with Filter/Pagination fetching
export const predefinedSuffixes = [
    'Jr.',
    'Sr.',
    'I',
    'II',
    'III',
    'IV',
    'Ph.D.',
    'M.D.',
    'Esq.',
] as const

export const FAMILY_RELATIONSHIP = [
    'Father',
    'Mother',
    'Son',
    'Daughter',
    'Brother',
    'Sister',
    'Husband',
    'Wife',
    'Partner',
    'Grandfather',
    'Grandmother',
    'Grandson',
    'Granddaughter',
    'Stepfather',
    'Stepmother',
    'Stepson',
    'Stepdaughter',
    'Half-Brother',
    'Half-Sister',
    'Foster Father',
    'Foster Mother',
    'Foster Son',
    'Foster Daughter',
    'Guardian',
    'Uncle',
    'Aunt',
    'Nephew',
    'Niece',
    'Cousin',
    'Father-in-Law',
    'Mother-in-Law',
    'Son-in-Law',
    'Daughter-in-Law',
    'Brother-in-Law',
    'Sister-in-Law',
    'Godfather',
    'Godmother',
    'Godson',
    'Goddaughter',
    'Adopted Son',
    'Adopted Daughter',
    'Ward',
    'Other',
] as const

export const AccountClosureReasons = [
    'Voluntary Withdrawal',
    'Inactive Membership',
    'Violation of Cooperative Rules',
    'Failure to Meet Financial Obligations',
    'Fraudulent Activities',
    'Transfer to Another Cooperative',
    'Death of Member',
    'Membership Revocation',
    'Request for Account Termination',
    'Other Personal Reasons',
    'Relocation Outside Service Area',
    'Better Opportunities Elsewhere',
    'Disagreement with Cooperative Direction',
    'Lack of Perceived Benefit',
    'Changes in Personal Circumstances (e.g., retirement, job change)',
    'Administrative Issues or Poor Service',
    'Merger or Dissolution of the Cooperative',
    'Financial Hardship',
    'Loss of Trust in Leadership',
    'Limited Engagement or Participation',
    'Becoming a Customer Only (if applicable)',
    'Desire for Simpler Financial Arrangements',
    'Conflict of Interest',
    'Feeling Undervalued or Unheard',
    'Changes in Cooperative Offerings',
    'Technological Disadvantages Compared to Other Options',
    'Success in Independent Ventures',
    'Inheritance or Windfall Allowing Independence',
    'Shifting Personal Values or Priorities',
    'Formation of a New, More Suitable Cooperative',
] as const

export const EDUCATIONAL_ATTAINMENT = [
    'elementary (incomplete)',
    'elementary graduate',
    'high school (incomplete)',
    'high school graduate',
    'senior high school (incomplete)',
    'senior high school graduate',
    'vocational / technical',
    'college (incomplete)',
    'college graduate',
    "master's (incomplete)",
    "master's graduate",
    'doctorate (incomplete)',
    'doctorate graduate',
    'others',
] as const

export const FEEDBACK_TYPE = ['bug', 'feature', 'general'] as const

export const GENERAL_STATUS = [
    'pending',
    'for review',
    'verified',
    'not allowed',
] as const

export const CIVIL_STATUS = [
    'married',
    'single',
    'widowed',
    'divorced',
    'separated',
    'civil partnership',
] as const

export const USER_TYPE = ['owner', 'employee', 'member', 'ban'] as const

export const USER_ORG_APPLICATION_STATUS = [
    'pending',
    'reported',
    'accepted',
    'ban',
] as const
