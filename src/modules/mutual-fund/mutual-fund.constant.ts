export const MUTUAL_FUND_COMPUTATION_TYPES = [
    'continuous', // continuous, okay even negative amount/balance
    'up_to_zero', // okay lang basta may laman/balance 20 tapos need 50 okay lang yun basta may laman
    'sufficient', // if mas malaki balance mo, example: may utang 20, ang need 50, hindi maiinclude
    // 'by_member_class_amount', //
    'by_membership_year', // (may schema) : Ex: 1mos to 12mos amount on the table scheme will be
    // use to less, else will fallback to claim amount
] as const
